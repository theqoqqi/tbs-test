
let nextUniqueId = 0;

export default class ArenaCell {

    constructor(position) {
        this.id = nextUniqueId++;
        this.position = position;
    }

    toString() {
        return `Cell #${this.id} (${this.position.x}, ${this.position.y})`;
    }
}