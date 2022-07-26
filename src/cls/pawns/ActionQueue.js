
export default class ActionQueue {

    #queue = Promise.resolve();

    #counter = 0;

    enqueue(action) {
        this.#counter++;
        this.#queue = this.#queue.then(() => {
            return action().then(() => {
                this.#counter--;
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

    get hasActions() {
        return this.#counter > 0;
    }
}