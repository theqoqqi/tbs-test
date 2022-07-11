
let nextUniqueId = 0;

export default class ArenaPawn {

    constructor(position, props) {
        this.id = nextUniqueId++;
        this.props = props;
        this.position = position;
        this.health = props.health;
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

    // getProperty(propertyName) {
    //
    // }

    toString() {
        return `Pawn #${this.id} (${this.position.x}, ${this.position.y})`;
    }
}