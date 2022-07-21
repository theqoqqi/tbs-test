import HitbackFrequency from '../enums/HitbackFrequency.js';
import PawnProps from '../context/PawnProps.js';
import Ability from './Ability.js';

let nextUniqueId = 0;

export default class Pawn {

    #health;

    #speed;

    #hitbacks;

    #abilities;

    #isWaiting = false;

    constructor(position, props, options) {
        this.id = nextUniqueId++;
        this.props = props;
        this.position = position;

        this.stackSize = options.stackSize;
        this.initialStackSize = options.stackSize;
        this.team = options.team;

        this.#initAbilities();

        this.refillHealth();
        this.refillSpeed();
        this.refillHitbacks();
    }

    #initAbilities() {
        this.#abilities = this.props.abilities.map(abilityProps => {
            return new Ability(abilityProps);
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

    consumeAllSpeed() {
        this.#speed = 0;
    }

    consumeSpeed(amount) {
        this.#speed = Math.max(0, this.#speed - amount);
    }

    giveSpeed(amount) {
        this.#speed = Math.max(0, this.#speed + amount);
    }

    refillSpeed() {
        this.#speed = this.maxSpeed;
    }

    consumeHitback() {
        this.#hitbacks--;
    }

    refillHitbacks() {
        this.#hitbacks = 0;

        if (this.hitback === HitbackFrequency.ONCE_PER_ROUND) {
            this.#hitbacks = 1;
        }

        if (this.hitback === HitbackFrequency.ALWAYS) {
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
        let kills = Math.ceil(killingDamage / this.maxHealth);
        let lostStackSize = this.initialStackSize - this.stackSize;

        return Math.max(-lostStackSize, Math.min(this.stackSize, kills));
    }

    //endregion



    //region Приватные методы

    #getProperty(propertyName) {
        return this.#getBaseProperty(propertyName);
    }

    #getBaseProperty(propertyName) {
        return this.props.get(propertyName);
    }

    toString() {
        return `Pawn #${this.id} (${this.position.x}, ${this.position.y})`;
    }

    //endregion



    //region Текущие показатели отряда

    get currentHealth() {
        return this.#health;
    }

    get currentSpeed() {
        return this.#speed;
    }

    get canHitback() {
        return this.#hitbacks > 0;
    }

    get abilities() {
        return this.#abilities;
    }

    get isWaiting() {
        return this.#isWaiting;
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

    get level() {
        return this.#getProperty(PawnProps.level);
    }

    get race() {
        return this.#getProperty(PawnProps.race);
    }

    get leadership() {
        return this.#getProperty(PawnProps.leadership);
    }

    get maxHealth() {
        return this.#getProperty(PawnProps.health);
    }

    get maxSpeed() {
        return this.#getProperty(PawnProps.speed);
    }

    get resistances() {
        return this.#getProperty(PawnProps.resistances);
    }

    get movementType() {
        return this.#getProperty(PawnProps.movementType);
    }

    get initiative() {
        return this.#getProperty(PawnProps.initiative);
    }

    get criticalHitChance() {
        return this.#getProperty(PawnProps.criticalHitChance);
    }

    get criticalHitMultiplier() {
        return this.#getProperty(PawnProps.criticalHitMultiplier);
    }

    get attack() {
        return this.#getProperty(PawnProps.attack);
    }

    get defence() {
        return this.#getProperty(PawnProps.defence);
    }

    get defenceBonus() {
        return this.#getProperty(PawnProps.defenceBonus);
    }

    get hitback() {
        return this.#getProperty(PawnProps.hitback);
    }

    get hitbackProtection() {
        return this.#getProperty(PawnProps.hitbackProtection);
    }

    //endregion



    //region Базовые свойства отряда

    get baseLevel() {
        return this.#getBaseProperty(PawnProps.level);
    }

    get baseRace() {
        return this.#getBaseProperty(PawnProps.race);
    }

    get baseLeadership() {
        return this.#getBaseProperty(PawnProps.leadership);
    }

    get baseMaxHealth() {
        return this.#getBaseProperty(PawnProps.health);
    }

    get baseMaxSpeed() {
        return this.#getBaseProperty(PawnProps.speed);
    }

    get baseResistances() {
        return this.#getBaseProperty(PawnProps.resistances);
    }

    get baseMovementType() {
        return this.#getBaseProperty(PawnProps.movementType);
    }

    get baseInitiative() {
        return this.#getBaseProperty(PawnProps.initiative);
    }

    get baseCriticalHitChance() {
        return this.#getBaseProperty(PawnProps.criticalHitChance);
    }

    get baseCriticalHitMultiplier() {
        return this.#getBaseProperty(PawnProps.criticalHitMultiplier);
    }

    get baseAttack() {
        return this.#getBaseProperty(PawnProps.attack);
    }

    get baseDefence() {
        return this.#getBaseProperty(PawnProps.defence);
    }

    get baseDefenseBonus() {
        return this.#getBaseProperty(PawnProps.defenceBonus);
    }

    get baseHitback() {
        return this.#getBaseProperty(PawnProps.hitback);
    }

    get baseHitbackProtection() {
        return this.#getBaseProperty(PawnProps.hitbackProtection);
    }

    //endregion
}