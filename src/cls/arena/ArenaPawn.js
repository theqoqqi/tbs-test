
let nextUniqueId = 0;

export default class ArenaPawn {

    constructor(position, props) {
        this.id = nextUniqueId++;
        this.props = props;
        this.position = position;
    }

    toString() {
        return `Pawn #${this.id} (${this.position.x}, ${this.position.y})`;
    }
}