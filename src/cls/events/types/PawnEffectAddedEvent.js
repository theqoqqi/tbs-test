import BaseEvent from './BaseEvent.js';

export default class PawnEffectAddedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.effect.added';
    }

    constructor(data) {
        super();
        this.effect = data.effect;
    }
}