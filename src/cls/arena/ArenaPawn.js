import PawnProps from '../context/PawnProps.js';

let nextUniqueId = 0;

export default class ArenaPawn {

    #health;

    #speed;

    constructor(position, props, options) {
        this.id = nextUniqueId++;
        this.props = props;
        this.position = position;

        this.#health = props.health;
        this.#speed = props.speed;

        this.stackSize = options.stackSize;
        this.initialStackSize = options.stackSize;
        this.team = options.team;
    }



    get currentHealth() {
        return this.#health;
    }

    get currentSpeed() {
        return this.#speed;
    }



    get stackLeadership() {
        return this.leadership * this.stackSize;
    }

    get stackHealth() {
        return this.maxHealth * (this.stackSize - 1) + this.currentHealth;
    }



    get level() {
        return this.#getPropertyValue(PawnProps.level);
    }

    get race() {
        return this.#getPropertyValue(PawnProps.race);
    }

    get leadership() {
        return this.#getPropertyValue(PawnProps.leadership);
    }

    get maxHealth() {
        return this.#getPropertyValue(PawnProps.health);
    }

    get speed() {
        return this.#getPropertyValue(PawnProps.speed);
    }

    get resistances() {
        return this.#getPropertyValue(PawnProps.resistances);
    }

    get movementType() {
        return this.#getPropertyValue(PawnProps.movementType);
    }

    get initiative() {
        return this.#getPropertyValue(PawnProps.initiative);
    }

    get criticalHitChance() {
        return this.#getPropertyValue(PawnProps.criticalHitChance);
    }

    get criticalHitMultiplier() {
        return this.#getPropertyValue(PawnProps.criticalHitMultiplier);
    }

    get attack() {
        return this.#getPropertyValue(PawnProps.attack);
    }

    get defence() {
        return this.#getPropertyValue(PawnProps.defence);
    }

    get defenceBonus() {
        return this.#getPropertyValue(PawnProps.defenceBonus);
    }

    get hitback() {
        return this.#getPropertyValue(PawnProps.hitback);
    }

    get hitbackProtection() {
        return this.#getPropertyValue(PawnProps.hitbackProtection);
    }

    get abilities() {
        return this.#getPropertyValue(PawnProps.abilities);
    }



    get baseLevel() {
        return this.#getBasePropertyValue(PawnProps.level);
    }

    get baseRace() {
        return this.#getBasePropertyValue(PawnProps.race);
    }

    get baseLeadership() {
        return this.#getBasePropertyValue(PawnProps.leadership);
    }

    get baseMaxHealth() {
        return this.#getBasePropertyValue(PawnProps.health);
    }

    get baseSpeed() {
        return this.#getBasePropertyValue(PawnProps.speed);
    }

    get baseResistances() {
        return this.#getBasePropertyValue(PawnProps.resistances);
    }

    get baseMovementType() {
        return this.#getBasePropertyValue(PawnProps.movementType);
    }

    get baseInitiative() {
        return this.#getBasePropertyValue(PawnProps.initiative);
    }

    get baseCriticalHitChance() {
        return this.#getBasePropertyValue(PawnProps.criticalHitChance);
    }

    get baseCriticalHitMultiplier() {
        return this.#getBasePropertyValue(PawnProps.criticalHitMultiplier);
    }

    get baseAttack() {
        return this.#getBasePropertyValue(PawnProps.attack);
    }

    get baseDefence() {
        return this.#getBasePropertyValue(PawnProps.defence);
    }

    get baseDefenseBonus() {
        return this.#getBasePropertyValue(PawnProps.defenceBonus);
    }

    get baseHitback() {
        return this.#getBasePropertyValue(PawnProps.hitback);
    }

    get baseHitbackProtection() {
        return this.#getBasePropertyValue(PawnProps.hitbackProtection);
    }

    get baseRegularAbility() {
        return this.#getBasePropertyValue(PawnProps.abilities);
    }



    applyDamage(damage) {
        let kills = this.getKillCount(damage);

        this.#health -= damage - kills * this.maxHealth;
        this.stackSize -= kills;

        if (this.stackSize <= 0) {
            this.stackSize = 0;
            this.#health = 0;
        }
    }

    consumeSpeed(amount) {
        this.#speed = Math.max(0, this.#speed - amount);
    }

    refillSpeed() {
        this.#speed = this.speed;
    }

    getKillCount(forDamage) {
        let killingDamage = forDamage - this.currentHealth + 1;
        let kills = Math.ceil(killingDamage / this.maxHealth);
        let lostStackSize = this.initialStackSize - this.stackSize;

        return Math.max(-lostStackSize, Math.min(this.stackSize, kills));
    }



    #getPropertyValue(propertyName) {
        return this.#getBasePropertyValue(propertyName);
    }

    #getBasePropertyValue(propertyName) {
        return this.props[propertyName];
    }

    toString() {
        return `Pawn #${this.id} (${this.position.x}, ${this.position.y})`;
    }
}