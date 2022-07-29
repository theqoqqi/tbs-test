import HitbackFrequency from '../enums/HitbackFrequency.js';
import Ability from './Ability.js';
import Vector from '../util/Vector.js';
import Feature from './Feature.js';
import PawnProps from './props/PawnProps.js';
import PawnType from '../enums/PawnType.js';
import Constants from '../Constants.js';

let nextUniqueId = 0;

export default class Pawn {

    #health;

    #actionPoints;

    #hitbacks;

    #features;

    #effects;

    #abilities;

    #isWaiting = false;

    #cachedProps = new Map();

    constructor(fight, unitName, props, options) {
        this.id = nextUniqueId++;
        this.fight = fight;
        this.unitName = unitName;
        this.props = props;
        this.position = Vector.ZERO;

        this.stackSize = options.stackSize;
        this.initialStackSize = options.stackSize;
        this.team = options.team;

        this.#initFeatures(options.features ?? []);
        this.#initEffects();
        this.#initAbilities(options.abilities ?? []);
        this.#bindListeners();

        this.refillHealth();
        this.refillActionPoints();
        this.refillHitbacks();
    }

    #initFeatures(features) {
        this.#features = features.map(featureProps => {
            return new Feature(this, featureProps);
        });
    }

    #initEffects() {
        this.#effects = [];
    }

    #initAbilities(abilities) {
        this.#abilities = abilities.map(abilityProps => {
            return new Ability(this, abilityProps);
        });
    }

    #bindListeners() {
        this.fight.addGlobalListener(() => {
            this.#clearCache();
        });
    }



    //region Публичные методы

    applyDamage(damage) {
        let kills = this.getKillCount(damage);

        this.#health -= damage - kills * this.maxHealth;
        this.stackSize -= kills;

        if (this.stackSize <= 0) {
            this.stackSize = 0;
            this.#health = 0;
        }
    }

    refillHealth() {
        this.#health = this.maxHealth;
    }

    consumeAllActionPoints() {
        this.#actionPoints = 0;
    }

    consumeActionPoints(amount) {
        this.#actionPoints = Math.max(0, this.#actionPoints - amount);
    }

    giveActionPoints(amount) {
        this.#actionPoints = Math.max(0, this.#actionPoints + amount);
    }

    refillActionPoints() {
        this.#actionPoints = this.maxActionPoints;
    }

    consumeHitback() {
        this.#hitbacks--;
    }

    refillHitbacks() {
        this.#hitbacks = 0;

        if (this.hitbackFrequency === HitbackFrequency.ONCE_PER_ROUND) {
            this.#hitbacks = 1;
        }

        if (this.hitbackFrequency === HitbackFrequency.ALWAYS) {
            this.#hitbacks = 999;
        }
    }

    setWaiting() {
        this.#isWaiting = true;
    }

    resetWaiting() {
        this.#isWaiting = false;
    }

    getKillCount(forDamage) {
        let killingDamage = forDamage - this.currentHealth + 1;
        let kills = Math.max(0, Math.ceil(killingDamage / this.maxHealth));
        let lostStackSize = this.initialStackSize - this.stackSize;

        return Math.max(-lostStackSize, Math.min(this.stackSize, kills));
    }

    applyCallbacks(propertyName, callbackExecutor) {
        this.#callForEachFeature(propertyName, callbackExecutor);
        this.#callForEachEffect(propertyName, callbackExecutor);
    }

    hasFeature(featureName) {
        return this.#features.some(feature => feature.internalName === featureName);
    }

    addEffect(effect) {
        this.#effects.push(effect);
    }

    removeEffect(effect) {
        let index = this.#effects.indexOf(effect);

        if (index !== -1) {
            this.#effects.splice(index, 1);
        }
    }

    getEffectByName(effectName) {
        return this.#effects.find(effect => effect.internalName === effectName);
    }

    getProperty(propertyName) {
        if (this.#cachedProps.has(propertyName)) {
            return this.#cachedProps.get(propertyName);
        }

        let value = this.#calculatePropertyValue(propertyName);

        this.#cachedProps.set(propertyName, value);

        return value;
    }

    getBaseProperty(propertyName) {
        return this.props.get(propertyName);
    }

    get isUsable() {
        return this.hasFeature(Constants.ACTIVATE_ON_USE_FEATURE_NAME);
    }

    get isCorpse() {
        return this.unitName === Constants.CORPSE_UNIT_NAME;
    }

    get isSquad() {
        return this.pawnType === PawnType.SQUAD;
    }

    get isStructure() {
        return this.pawnType === PawnType.STRUCTURE;
    }

    get isItem() {
        return this.pawnType === PawnType.ITEM;
    }

    get performsMoves() {
        return this.maxActionPoints > 0 && [PawnType.SQUAD, PawnType.STRUCTURE].includes(this.pawnType);
    }

    //endregion



    //region Приватные методы

    #callForEachFeature(propertyName, callback) {
        Pawn.#callForEachWithBind(this.features, propertyName, callback);
    }

    #callForEachEffect(propertyName, callback) {
        Pawn.#callForEachWithBind(this.effects, propertyName, callback);
    }

    #calculatePropertyValue(propertyName) {
        let value = this.getBaseProperty(propertyName);

        this.applyCallbacks('modifyPawnProperty', callback => {
            value = callback({
                propertyName,
                value,
            });
        });

        let otherPawns = this.fight.arena.getAllPawns()
            .filter(pawn => pawn !== this);

        for (const otherPawn of otherPawns) {
            otherPawn.applyCallbacks('modifyOtherPawnProperty', callback => {
                value = callback({
                    pawn: this,
                    propertyName,
                    value,
                });
            });
        }

        return this.props.postProcess(propertyName, value);
    }

    #clearCache() {
        this.#cachedProps.clear();
    }

    static #callForEachWithBind(elements, propertyName, callback) {
        for (let element of elements) {
            let property = element[propertyName];

            if (property) {
                callback(property.bind(element));
            }
        }
    }

    toString() {
        return `Pawn #${this.id} (${this.position.x}, ${this.position.y})`;
    }

    //endregion



    //region Текущие показатели отряда

    get currentHealth() {
        return this.#health;
    }

    get currentActionPoints() {
        return this.#actionPoints;
    }

    get canHitback() {
        return this.#hitbacks > 0;
    }

    get isWaiting() {
        return this.#isWaiting;
    }

    get features() {
        return this.#features;
    }

    get effects() {
        return this.#effects;
    }

    get abilities() {
        return this.#abilities;
    }

    //endregion



    //region Суммарные показатели отряда

    get stackLeadership() {
        return this.leadership * this.stackSize;
    }

    get stackHealth() {
        return this.maxHealth * (this.stackSize - 1) + this.currentHealth;
    }

    //endregion



    //region Текущие свойства отряда

    get pawnType() {
        return this.getProperty(PawnProps.pawnType);
    }

    get level() {
        return this.getProperty(PawnProps.level);
    }

    get race() {
        return this.getProperty(PawnProps.race);
    }

    get leadership() {
        return this.getProperty(PawnProps.leadership);
    }

    get morale() {
        return this.getProperty(PawnProps.morale);
    }

    get maxHealth() {
        return this.getProperty(PawnProps.health);
    }

    get maxActionPoints() {
        return this.getProperty(PawnProps.actionPoints);
    }

    get resistances() {
        return this.getProperty(PawnProps.resistances);
    }

    get movementType() {
        return this.getProperty(PawnProps.movementType);
    }

    get initiative() {
        return this.getProperty(PawnProps.initiative);
    }

    get criticalHitChance() {
        return this.getProperty(PawnProps.criticalHitChance);
    }

    get criticalHitMultiplier() {
        return this.getProperty(PawnProps.criticalHitMultiplier);
    }

    get attack() {
        return this.getProperty(PawnProps.attack);
    }

    get defence() {
        return this.getProperty(PawnProps.defence);
    }

    get defenceBonus() {
        return this.getProperty(PawnProps.defenceBonus);
    }

    get invulnerable() {
        return this.getProperty(PawnProps.invulnerable);
    }

    get hitbackFrequency() {
        return this.getProperty(PawnProps.hitbackFrequency);
    }

    get hitbackProtection() {
        return this.getProperty(PawnProps.hitbackProtection);
    }

    //endregion



    //region Базовые свойства отряда

    get basePawnType() {
        return this.getBaseProperty(PawnProps.pawnType);
    }

    get baseLevel() {
        return this.getBaseProperty(PawnProps.level);
    }

    get baseRace() {
        return this.getBaseProperty(PawnProps.race);
    }

    get baseLeadership() {
        return this.getBaseProperty(PawnProps.leadership);
    }

    get baseMorale() {
        return this.getBaseProperty(PawnProps.morale);
    }

    get baseMaxHealth() {
        return this.getBaseProperty(PawnProps.health);
    }

    get baseMaxActionPoints() {
        return this.getBaseProperty(PawnProps.actionPoints);
    }

    get baseResistances() {
        return this.getBaseProperty(PawnProps.resistances);
    }

    get baseMovementType() {
        return this.getBaseProperty(PawnProps.movementType);
    }

    get baseInitiative() {
        return this.getBaseProperty(PawnProps.initiative);
    }

    get baseCriticalHitChance() {
        return this.getBaseProperty(PawnProps.criticalHitChance);
    }

    get baseCriticalHitMultiplier() {
        return this.getBaseProperty(PawnProps.criticalHitMultiplier);
    }

    get baseAttack() {
        return this.getBaseProperty(PawnProps.attack);
    }

    get baseDefence() {
        return this.getBaseProperty(PawnProps.defence);
    }

    get baseDefenseBonus() {
        return this.getBaseProperty(PawnProps.defenceBonus);
    }

    get baseInvulnerable() {
        return this.getBaseProperty(PawnProps.invulnerable);
    }

    get baseHitbackFrequency() {
        return this.getBaseProperty(PawnProps.hitbackFrequency);
    }

    get baseHitbackProtection() {
        return this.getBaseProperty(PawnProps.hitbackProtection);
    }

    //endregion
}