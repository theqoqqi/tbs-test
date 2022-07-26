
export default class AbstractEffect {

    #owner;

    #props;

    constructor(owner, props) {
        this.#owner = owner;
        this.#props = props;
    }



    get owner() {
        return this.#owner;
    }

    get fight() {
        return this.#owner.fight;
    }



    get internalName() {
        return this.getProperty('internalName');
    }

    get scriptParams() {
        return this.getProperty('scriptParams');
    }

    get getEvents() {
        return this.getProperty('getEvents');
    }

    get modifyPawnProperty() {
        return this.getProperty('modifyPawnProperty');
    }

    get incomingDamageModifier() {
        return this.getProperty('incomingDamageModifier');
    }

    get outcomingDamageModifier() {
        return this.getProperty('outcomingDamageModifier');
    }

    get isHidden() {
        return this.getProperty('isHidden');
    }



    getProperty(propertyName) {
        return this.#props[propertyName];
    }
}