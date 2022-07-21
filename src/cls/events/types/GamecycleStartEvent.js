import BaseEvent from './BaseEvent.js';

export default class GamecycleStartEvent extends BaseEvent {

    static get eventName() {
        return 'gamecycle.start';
    }

    constructor(data) {
        super();
    }
}