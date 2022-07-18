
export default class HitInfo {

    #targetName;
    #minDamage;
    #maxDamage;
    #minKills;
    #maxKills;
    #willHitback;

    constructor({targetName, minDamage, maxDamage, minKills, maxKills, willHitback}) {
        this.#targetName = targetName;
        this.#minDamage = minDamage;
        this.#maxDamage = maxDamage;
        this.#minKills = minKills;
        this.#maxKills = maxKills;
        this.#willHitback = willHitback;
    }

    get targetName() {
        return this.#targetName;
    }

    get minDamage() {
        return this.#minDamage;
    }

    get maxDamage() {
        return this.#maxDamage;
    }

    get minKills() {
        return this.#minKills;
    }

    get maxKills() {
        return this.#maxKills;
    }

    get willHitback() {
        return this.#willHitback;
    }
}