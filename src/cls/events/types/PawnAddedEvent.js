import BaseEvent from './BaseEvent.js';

export default class PawnAddedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.added';
    }

    constructor(data) {
        super();
        this.pawn = data.pawn;
    }
}