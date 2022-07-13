import PassabilityTypes from './PassabilityTypes.js';

let nextUniqueId = 0;

export default class ArenaCell {

    constructor(position) {
        this.id = nextUniqueId++;
        this.position = position;
        this.passability = PassabilityTypes.WALKING_PASSABLE;
    }

    toString() {
        return `Cell #${this.id} (${this.position.x}, ${this.position.y})`;
    }
}