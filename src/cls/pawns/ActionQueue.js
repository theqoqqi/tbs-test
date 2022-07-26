import ActionQueueStartEvent from '../events/types/ActionQueueStartEvent.js';
import ActionQueueStopEvent from '../events/types/ActionQueueStopEvent.js';

export default class ActionQueue {

    #eventBus;

    #queue = Promise.resolve();

    #counter = 0;

    constructor(eventBus) {
        this.#eventBus = eventBus;
    }

    enqueue(action) {
        this.increaseCounter();
        this.#queue = this.#queue.then(() => {
            return action().then(() => {
                this.decreaseCounter();
            });
        });
    }

    getPromise() {
        return new Promise(resolve => {
            let intervalId = setInterval(() => {
                if (this.#counter === 0) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 100);
        });
    }

    increaseCounter() {
        this.#counter++;

        if (this.#counter === 1) {
            this.#eventBus.dispatch(ActionQueueStartEvent);
        }
    }

    decreaseCounter() {
        this.#counter--;

        if (this.#counter === 0) {
            this.#eventBus.dispatch(ActionQueueStopEvent);
        }
    }
}