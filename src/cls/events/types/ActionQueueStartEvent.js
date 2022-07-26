import BaseEvent from './BaseEvent.js';

export default class ActionQueueStartEvent extends BaseEvent {

    static get eventName() {
        return 'action-queue.start';
    }
}