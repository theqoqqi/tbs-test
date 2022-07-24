import BaseEvent from './BaseEvent.js';

export default class PawnRemovedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.removed';
    }

    constructor(data) {
        super();
        this.pawn = data.pawn;
    }
}