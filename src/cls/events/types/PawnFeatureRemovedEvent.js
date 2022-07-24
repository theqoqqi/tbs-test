import BaseEvent from './BaseEvent.js';

export default class PawnFeatureRemovedEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.feature.removed';
    }

    constructor(data) {
        super();
        this.feature = data.feature;
    }
}