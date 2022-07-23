
export default class AbstractEffect {

    #props;

    constructor(props) {
        this.#props = props;
    }



    get internalName() {
        return this.#getProperty('internalName');
    }

    get scriptParams() {
        return this.#getProperty('scriptParams');
    }

    get incomingDamageModifier() {
        return this.#getProperty('incomingDamageModifier');
    }

    get outcomingDamageModifier() {
        return this.#getProperty('outcomingDamageModifier');
    }



    #getProperty(propertyName) {
        return this.#props[propertyName];
    }
}