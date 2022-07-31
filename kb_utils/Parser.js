
module.exports = class Parser {

    static keyCharsRegex = /[@~.?\w]/;

    pos;

    constructor() {
        this.pos = 0;
    }

    parseConfig(text) {
        this.text = text;
        this.pos = 0;

        this.removeComments();

        return this.parseFields(text);
    }

    removeComments() {
        this.text = this.text.split('\n')
            .map(line => line.replace(/\/\/.*/, ''))
            .join('\n');
    }

    parseFields() {
        let fields = {};

        this.skipSpaces();

        while (this.hasNext && this.checkChar(Parser.keyCharsRegex)) {
            let [key, value] = this.parseField();

            Parser.#addField(fields, key, value);

            this.skipSpaces();
        }

        return fields;
    }

    static #addField(fields, key, value) {
        if (Array.isArray(fields[key])) {
            fields[key].push(value);
        } else if (fields[key] !== undefined) {
            fields[key] = [fields[key], value];
        } else {
            fields[key] = value;
        }
    }

    parseField() {
        this.skipSpaces();

        let key = this.readWhile(Parser.keyCharsRegex);

        this.skipSpaces();

        if (this.checkChar(/=/)) {
            this.skip('=');
            this.skipSpaces(false);

            let value = this.readUntil(/\n/).trimRight();

            return [key, value];
        }

        if (this.checkChar(/[{(]/)) {
            this.skip('{(');
            this.skipSpaces();

            let value = this.parseFields();

            this.skip('})');

            return [key, value];
        }

        if (this.checkChar(/\n/)) {
            return '';
        }

        throw new Error(`Unexpected char: ${this.current}, Line: ${this.line}, Char: ${this.linePos}, Key: ${key}`);
    }



    readWhile(regex) {
        let string = '';

        while (this.hasNext && this.checkChar(regex)) {
            string += this.current;
            this.next();
        }

        return string;
    }

    readUntil(regex) {
        let string = '';

        while (this.hasNext && !this.checkChar(regex)) {
            string += this.current;
            this.next();
        }

        return string;
    }

    skipSpaces(withNewLine = true) {
        if (withNewLine) {
            this.skip(' \r\n\t\uFEFF');
        } else {
            this.skip(' \t');
        }
    }

    skip(chars) {
        while(this.hasNext && chars.includes(this.current)) {
            this.next();
        }
    }

    checkChar(regex, offset = 0) {
        return regex.test(this.look(offset));
    }

    next() {
        this.pos++;
        return this.current;
    }

    look(n = 1) {
        return this.text[this.pos + n] ?? null;
    }

    get hasNext() {
        return this.pos < this.text.length;
    }

    get line() {
        return this.text.slice(0, this.pos).split('\n').length;
    }

    get linePos() {
        return this.pos - this.text.slice(0, this.pos).lastIndexOf('\n');
    }

    get current() {
        return this.text[this.pos] ?? null;
    }
};