export default class Race {

    #name;

    #iconImage;

    constructor(name, icon) {
        this.#name = name;
        this.#iconImage = icon;
    }

    get name() {
        return this.#name;
    }

    get iconImage() {
        return this.#iconImage;
    }
}