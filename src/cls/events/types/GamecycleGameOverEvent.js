import BaseEvent from './BaseEvent.js';

export default class GamecycleGameOverEvent extends BaseEvent {

    static get eventName() {
        return 'gamecycle.gameOver';
    }

    constructor(data) {
        super();
    }
}