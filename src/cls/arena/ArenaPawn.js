
let nextUniqueId = 0;

export default class ArenaPawn {

    constructor(position, props, options) {
        this.id = nextUniqueId++;
        this.props = props;
        this.position = position;
        this.health = props.health;
        this.count = options.count;
        this.team = options.team;
    }

    get currentHealth() {
        return this.health;
    }

    get maxHealth() {
        return this.props.health;
    }

    get speed() {
        return this.props.speed;
    }

    get damage() {
        return this.props.damage;
    }

    get movementType() {
        return this.props.movementType;
    }

    // getProperty(propertyName) {
    //
    // }

    applyDamage(damage) {
        this.health -= damage;
    }

    toString() {
        return `Pawn #${this.id} (${this.position.x}, ${this.position.y})`;
    }
}