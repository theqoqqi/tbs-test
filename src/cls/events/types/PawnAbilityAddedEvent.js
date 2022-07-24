import BaseEvent from './BaseEvent.js';

export default class PawnAbilityAddedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.ability.added';
    }

    constructor(data) {
        super();
        this.ability = data.ability;
    }
}