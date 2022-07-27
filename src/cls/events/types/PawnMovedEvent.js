import BaseEvent from './BaseEvent.js';

export default class PawnMovedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.moved';
    }

    constructor(data) {
        super();
        this.pawn = data.pawn;
    }
}