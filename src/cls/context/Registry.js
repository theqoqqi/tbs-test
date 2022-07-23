
export default class Registry {

    constructor() {
        this.itemsByNames = new Map();
    }

    register(name, item) {
        this.itemsByNames.set(name, item);
    }

    get(name) {
        return this.itemsByNames.get(name);
    }
}