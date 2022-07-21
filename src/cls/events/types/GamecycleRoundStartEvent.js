import BaseEvent from './BaseEvent.js';

export default class GamecycleRoundStartEvent extends BaseEvent {

    static get eventName() {
        return 'gamecycle.round.start';
    }

    constructor(data) {
        super();
        this.round = data.round;
    }
}