export default class MoveInfo {

    #actionInfos;

    constructor({actionInfos}) {
        this.#actionInfos = actionInfos;
    }

    get actionInfos() {
        return this.#actionInfos;
    }
}