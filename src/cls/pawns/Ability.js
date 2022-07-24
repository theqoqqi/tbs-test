let nextUniqueId = 0;

export default class Ability {

    #owner;

    #props;

    #currentReload;

    #currentCharges;

    constructor(owner, props) {
        this.id = nextUniqueId++;
        this.#owner = owner;
        this.#props = props;

        this.#currentReload = 0;
        this.#currentCharges = props.charges;
    }



    get owner() {
        return this.#owner;
    }

    get fight() {
        return this.#owner.fight;
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
        return this.#getProperty('slot');
    }

    get scriptParams() {
        return this.#getProperty('scriptParams');
    }

    get getEvents() {
        return this.#getProperty('getEvents');
    }

    get targetCollector() {
        return this.#getProperty('targetCollector');
    }

    get apply() {
        return this.#getProperty('apply');
    }

    get damageRanges() {
        return this.#getProperty('damageRanges');
    }

    get minDistance() {
        return this.#getProperty('minDistance');
    }

    get maxDistance() {
        return this.#getProperty('maxDistance');
    }

    get distancePenalty() {
        return this.#getProperty('distancePenalty');
    }

    get disabledIfNearEnemy() {
        return this.#getProperty('disabledIfNearEnemy');
    }

    get endsTurn() {
        return this.#getProperty('endsTurn');
    }

    get mutedIfNearEnemy() {
        return this.#getProperty('mutedIfNearEnemy');
    }

    get noHitbacks() {
        return this.#getProperty('noHitbacks');
    }

    get reload() {
        return this.#getProperty('reload');
    }

    get charges() {
        return this.#getProperty('charges');
    }

    get hintTitle() {
        return this.#getProperty('hintTitle');
    }

    get hintDescription() {
        return this.#getProperty('hintDescription');
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



    #getProperty(propertyName) {
        return this.#props[propertyName];
    }
}