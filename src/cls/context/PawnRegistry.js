
export default class PawnRegistry {

    constructor() {
        this.pawnPropsByNames = new Map();
    }

    register(name, pawnProps) {
        pawnProps.name = name;
        this.pawnPropsByNames.set(name, pawnProps);
    }

    get(name) {
        return this.pawnPropsByNames.get(name);
    }
}