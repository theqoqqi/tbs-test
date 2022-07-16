
export default class Race {

    #iconImage;

    constructor(icon) {
        this.#iconImage = icon;
    }

    get iconImage() {
        return this.#iconImage;
    }
}