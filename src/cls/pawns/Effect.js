import AbstractEffect from './AbstractEffect.js';

let nextUniqueId = 0;

export default class Effect extends AbstractEffect {

    #duration;

    #isInfinite;

    constructor(owner, props, options) {
        super(owner, props);
        this.id = nextUniqueId++;
        this.#duration = options.duration ?? 1;
        this.#isInfinite = options.isInfinite ?? false;
    }

    get isInfinite() {
        return this.#duration <= 0;
    }

    get isExpired() {
        return !this.#isInfinite && this.#duration <= 0;
    }

    get duration() {
        return this.#duration;
    }

    decreaseDuration() {
        if (!this.#isInfinite) {
            this.#duration--;
        }
    }

    ensureDuration(minDuration) {
        if (this.#duration < minDuration) {
            this.#duration = minDuration;
        }
    }
}