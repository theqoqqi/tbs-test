import BaseEvent from './BaseEvent.js';

export default class PawnFeatureAddedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.feature.added';
    }

    constructor(data) {
        super();
        this.feature = data.feature;
    }
}