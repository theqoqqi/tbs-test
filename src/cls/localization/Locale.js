
export default class Locale {

    #translations = new Map();

    constructor(jsons) {
        jsons.forEach(json => this.readJson(json));
    }

    readJson(json) {
        for (const [key, value] of Object.entries(json)) {
            this.#translations.set(key, value);
        }
    }

    get(translationKey, variables = null) {
        if (!this.#translations.has(translationKey)) {
            return translationKey;
        }

        let translation = this.#translations.get(translationKey);

        return translation.replaceAll(/\[(\w+)(%?)]/g, (match, variableKey, format) => {
            let variable = variables?.get(variableKey) ?? variableKey;

            if (format === '%') {
                variable = variable + '%';
            }

            return variable;
        });
    }
}