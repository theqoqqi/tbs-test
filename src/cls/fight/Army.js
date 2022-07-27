
export default class Army {

    #team = [];

    #squads = [];

    constructor(team) {
        this.#team = team
    }

    addSquad(unitName, stackSize, options = {}) {
        options.stackSize = stackSize;

        this.#squads.push({
            unitName,
            options,
        });
    }

    get team() {
        return this.#team;
    }

    get squads() {
        return this.#squads;
    }
}