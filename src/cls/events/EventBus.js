import EventEmitter from 'eventemitter3';

export default class EventBus {

    #emitter;

    #globalListeners;

    constructor() {
        this.#emitter = new EventEmitter();
        this.#globalListeners = [];
    }

    addGlobalListener(listener) {
        this.#globalListeners.push(listener);
    }

    removeGlobalListener(listener) {
        let index = this.#globalListeners.indexOf(listener);

        if (index !== -1) {
            this.#globalListeners.splice(index, 1);
        }
    }

    on(eventType, callback, context = undefined) {
        let eventName = EventBus.#getEventName(eventType);

        this.#emitter.on(eventName, callback, context);
    }

    off(eventType, callback) {
        let eventName = EventBus.#getEventName(eventType);

        this.#emitter.off(eventName, callback);
    }

    dispatch(eventType, eventData = {}) {
        let eventName = EventBus.#getEventName(eventType);
        let event = new eventType(eventData);

        this.#emitter.emit(eventName, event);

        for (let listener of this.#globalListeners) {
            listener(eventType, event);
        }
    }

    static #getEventName(eventType) {
        return eventType.eventName;
    }
}