
export default class Ranges {

    #ranges = new Map();

    constructor(ranges) {
        for (const args of ranges) {
            let [type, min, max] = args;

            this.#ranges.set(type, {
                min, max
            });
        }
    }

    getMin(type) {
        return this.#ranges.get(type).min;
    }

    getMax(type) {
        return this.#ranges.get(type).max;
    }

    get combinedMin() {
        return this.#combineSum('min');
    }

    get combinedMax() {
        return this.#combineSum('max');
    }

    keys() {
        return Array.from(this.#ranges.keys());
    }

    #combineSum(field) {
        let sum = 0;

        for (let value of this.#ranges.values()) {
            sum += value[field] ?? 0;
        }

        return sum;
    }
}