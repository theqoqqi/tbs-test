import BaseEvent from './BaseEvent.js';

export default class GamecycleTurnStartEvent extends BaseEvent {

    static get eventName() {
        return 'gamecycle.turn.start';
    }

    constructor(data) {
        super();
        this.round = data.round;
        this.turn = data.turn;
    }
}