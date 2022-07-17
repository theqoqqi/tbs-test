
export default class Ability {

    #slot;

    #targetCollector;

    #damageRanges;

    #minDistance;

    #maxDistance;

    #distancePenalty;

    #disabledIfNearEnemy;

    constructor({slot, targetCollector, damageRanges, minDistance, maxDistance, distancePenalty, disabledIfNearEnemy}) {
        this.#slot = slot;
        this.#targetCollector = targetCollector ?? (() => []);
        this.#damageRanges = damageRanges;
        this.#minDistance = minDistance ?? null;
        this.#maxDistance = maxDistance ?? null;
        this.#distancePenalty = distancePenalty ?? 1;
        this.#disabledIfNearEnemy = disabledIfNearEnemy ?? false;
    }

    get slot() {
        return this.#slot;
    }

    get targetCollector() {
        return this.#targetCollector;
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
        return this.#distancePenalty;
    }

    get disabledIfNearEnemy() {
        return this.#disabledIfNearEnemy;
    }
}