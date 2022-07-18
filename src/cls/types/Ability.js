
let nextUniqueId = 0;

export default class Ability {

    #props;

    constructor(props) {
        this.id = nextUniqueId++;
        this.#props = props;
    }



    get slot() {
        return this.#getPropertyValue('slot');
    }

    get targetCollector() {
        return this.#getPropertyValue('targetCollector');
    }

    get damageRanges() {
        return this.#getPropertyValue('damageRanges');
    }

    get minDistance() {
        return this.#getPropertyValue('minDistance');
    }

    get maxDistance() {
        return this.#getPropertyValue('maxDistance');
    }

    get distancePenalty() {
        return this.#getPropertyValue('distancePenalty');
    }

    get disabledIfNearEnemy() {
        return this.#getPropertyValue('disabledIfNearEnemy');
    }

    get noHitbacks() {
        return this.#getPropertyValue('noHitbacks');
    }




    #getPropertyValue(propertyName) {
        return this.#props[propertyName];
    }
}