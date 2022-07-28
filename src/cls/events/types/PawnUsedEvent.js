import BaseEvent from './BaseEvent.js';

export default class PawnUsedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.used';
    }

    constructor(data) {
        super();
        this.usedBy = data.usedBy;
        this.usedPawn = data.usedPawn;
    }
}