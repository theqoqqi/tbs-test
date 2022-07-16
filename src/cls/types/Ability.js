
export default class Ability {

    #slot;

    #damageRanges;

    #minDistance;

    #maxDistance;

    #distancePenalty;

    constructor({slot, damageRanges, minDistance, maxDistance, distancePenalty}) {
        this.#slot = slot;
        this.#damageRanges = damageRanges;
        this.#minDistance = minDistance ?? null;
        this.#maxDistance = maxDistance ?? 1;
        this.#distancePenalty = distancePenalty ?? 1;
    }

    get slot() {
        return this.#slot;
    }

    get damageRanges() {
        return this.#damageRanges;
    }

    get minDistance() {
        return this.#minDistance;
    }

    get maxDistance() {
        return this.#maxDistance;
    }

    get distancePenalty() {
        return this.#maxDistance;
    }
}