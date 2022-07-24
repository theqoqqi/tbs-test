import BaseEvent from './BaseEvent.js';

export default class PawnEffectRemovedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.effect.removed';
    }

    constructor(data) {
        super();
        this.effect = data.effect;
    }
}