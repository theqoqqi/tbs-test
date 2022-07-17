import AbilityTargetCollector from '../enums/AbilityTargetCollector.js';

export default class Ability {

    #slot;

    #targetCollector;

    #damageRanges;

    #minDistance;

    #maxDistance;

    #distancePenalty;

    constructor({slot, targetCollector, damageRanges, minDistance, maxDistance, distancePenalty}) {
        this.#slot = slot;
        this.#targetCollector = targetCollector ?? AbilityTargetCollector.MELEE;
        this.#damageRanges = damageRanges;
        this.#minDistance = minDistance ?? null;
        this.#maxDistance = maxDistance ?? 1;
        this.#distancePenalty = distancePenalty ?? 1;
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
}