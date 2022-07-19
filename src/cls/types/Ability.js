
let nextUniqueId = 0;

export default class Ability {

    #props;

    #currentReload;

    #currentCharges;

    constructor(props) {
        this.id = nextUniqueId++;
        this.#props = props;

        this.#currentReload = 0;
        this.#currentCharges = props.charges;
    }



    get currentReload() {
        return this.#currentReload;
    }

    get currentCharges() {
        return this.#currentCharges;
    }



    get slot() {
        return this.#getPropertyValue('slot');
    }

    get scriptParams() {
        return this.#getPropertyValue('scriptParams');
    }

    get targetCollector() {
        return this.#getPropertyValue('targetCollector');
    }

    get apply() {
        return this.#getPropertyValue('apply');
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

    get endsTurn() {
        return this.#getPropertyValue('endsTurn');
    }

    get mutedIfNearEnemy() {
        return this.#getPropertyValue('mutedIfNearEnemy');
    }

    get noHitbacks() {
        return this.#getPropertyValue('noHitbacks');
    }

    get reload() {
        return this.#getPropertyValue('reload');
    }

    get charges() {
        return this.#getPropertyValue('charges');
    }

    get hintTitle() {
        return this.#getPropertyValue('hintTitle');
    }

    get hintDescription() {
        return this.#getPropertyValue('hintDescription');
    }




    #getPropertyValue(propertyName) {
        return this.#props[propertyName];
    }
}