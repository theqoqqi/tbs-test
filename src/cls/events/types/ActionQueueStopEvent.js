import BaseEvent from './BaseEvent.js';

export default class ActionQueueStopEvent extends BaseEvent {

    static get eventName() {
        return 'action-queue.stop';
    }
}