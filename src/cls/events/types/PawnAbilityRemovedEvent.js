import BaseEvent from './BaseEvent.js';

export default class PawnAbilityRemovedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.ability.removed';
    }

    constructor(data) {
        super();
        this.ability = data.ability;
    }
}