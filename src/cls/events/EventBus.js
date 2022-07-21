import EventEmitter from 'eventemitter3';

export default class EventBus {

    #emitter;

    constructor() {
        this.#emitter = new EventEmitter();
    }

    on(eventType, callback, context = undefined) {
        let eventName = EventBus.#getEventName(eventType);

        this.#emitter.on(eventName, callback, context);
    }

    off(eventType, callback) {
        let eventName = EventBus.#getEventName(eventType);

        this.#emitter.off(eventName, callback);
    }

    dispatch(eventType, eventData) {
        let eventName = EventBus.#getEventName(eventType);

        this.#emitter.emit(eventName, new eventType(eventData));
    }

    static #getEventName(eventType) {
        return eventType.eventName;
    }
}