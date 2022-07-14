export default class Enum {

    static closeEnum() {
        const enumKeys = [];
        const enumValues = [];

        for (const [key, value] of Object.entries(this)) {

            value.enumKey = key;
            value.enumOrdinal = enumValues.length;

            enumKeys.push(key);
            enumValues.push(value);
        }

        this.enumKeys = enumKeys;
        this.enumValues = enumValues;
    }

    static enumValueOf(str) {
        const index = this.enumKeys.indexOf(str);

        if (index >= 0) {
            return this.enumValues[index];
        }

        return undefined;
    }

    static [Symbol.iterator]() {
        return this.enumValues[Symbol.iterator]();
    }

    toString() {
        // noinspection JSUnresolvedVariable
        return this.constructor.name + '.' + this.enumKey;
    }
}