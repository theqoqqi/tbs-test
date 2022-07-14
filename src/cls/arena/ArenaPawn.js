
let nextUniqueId = 0;

export default class ArenaPawn {

    constructor(position, props, options) {
        this.id = nextUniqueId++;
        this.props = props;
        this.position = position;
        this.health = props.health;
        this.stackSize = options.stackSize;
        this.team = options.team;
    }



    get currentHealth() {
        return this.health;
    }



    get stackMinDamage() {
        return this.minDamage * this.stackSize;
    }

    get stackMaxDamage() {
        return this.maxDamage * this.stackSize;
    }

    get stackHealth() {
        return this.maxHealth * (this.stackSize - 1) + this.currentHealth;
    }



    get maxHealth() {
        return this.#getPropertyValue('health');
    }

    get speed() {
        return this.#getPropertyValue('speed');
    }

    get minDamage() {
        return this.#getPropertyValue('minDamage');
    }

    get maxDamage() {
        return this.#getPropertyValue('maxDamage');
    }

    get movementType() {
        return this.#getPropertyValue('movementType');
    }



    get baseMaxHealth() {
        return this.#getBasePropertyValue('health');
    }

    get baseSpeed() {
        return this.#getBasePropertyValue('speed');
    }

    get baseMinDamage() {
        return this.#getBasePropertyValue('minDamage');
    }

    get baseMaxDamage() {
        return this.#getBasePropertyValue('maxDamage');
    }

    get baseMovementType() {
        return this.#getBasePropertyValue('movementType');
    }



    #getPropertyValue(propertyName) {
        return this.#getBasePropertyValue(propertyName);
    }

    #getBasePropertyValue(propertyName) {
        return this.props[propertyName];
    }

    applyDamage(damage) {
        let kills = this.getKillCount(damage);

        this.health -= damage - kills * this.maxHealth;
        this.stackSize -= kills;

        if (this.stackSize <= 0) {
            this.stackSize = 0;
            this.health = 0;
        }
    }

    getKillCount(forDamage) {
        let killingDamage = forDamage - this.currentHealth + 1;

        return Math.ceil(killingDamage / this.maxHealth);
    }

    toString() {
        return `Pawn #${this.id} (${this.position.x}, ${this.position.y})`;
    }
}