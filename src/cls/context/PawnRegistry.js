
export default class PawnRegistry {

    constructor() {
        this.pawnPropsByNames = new Map();
        this.optionsByNames = new Map();
    }

    register(name, pawnProps, options) {
        pawnProps.name = name;
        this.pawnPropsByNames.set(name, pawnProps);
        this.optionsByNames.set(name, options);
    }

    getProps(name) {
        return this.pawnPropsByNames.get(name);
    }

    getOptions(name) {
        return this.optionsByNames.get(name);
    }
}