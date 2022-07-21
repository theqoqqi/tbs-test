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

    get isReloading() {
        return this.#currentReload > 0;
    }

    get currentCharges() {
        return this.#currentCharges;
    }

    get hasCharges() {
        return this.#currentCharges > 0;
    }

    get usesCharges() {
        return this.charges !== null;
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



    consumeCharges(charges) {
        this.#currentCharges = Math.max(0, this.currentCharges - charges);
    }

    giveCharges(charges) {
        this.#currentCharges = Math.max(0, this.currentCharges + charges);
    }

    startReloading() {
        this.#currentReload = this.reload;
    }

    finishReloading() {
        this.#currentReload = 0;
    }

    tickReloading() {
        if (this.isReloading) {
            this.#currentReload--;
        }
    }



    #getPropertyValue(propertyName) {
        return this.#props[propertyName];
    }
}