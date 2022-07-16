import DamageType from '../enums/DamageType.js';
import Constants from '../Constants.js';

export default class Resistances {

    #resistances = new Map();

    constructor(resistances = []) {
        for (const damageType of DamageType.enumValues) {
            this.#resistances.set(damageType, 0);
        }

        for (const args of resistances) {
            let [type, resistance] = args;

            this.#resistances.set(type, resistance);
        }
    }

    get(damageType) {
        let resistance = this.#resistances.get(damageType) ?? 0;

        return Math.min(Constants.MAX_RESISTANCE, resistance);
    }
}