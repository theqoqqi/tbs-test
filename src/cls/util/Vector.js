export default class Vector {

    static ZERO = new Vector();

    #x;

    #y;

    #z;

    constructor(x, y, z) {
        this.#x = x || 0;
        this.#y = y || 0;
        this.#z = z || 0;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get z() {
        return this.#z;
    }

    set(xOrVector, yy, zz) {
        let {x, y, z} = Vector.#unifyArgs(arguments);
        return new Vector(x, y, z);
    }

    negate() {
        this.set(-this.x, -this.y, -this.z);
    }

    add(xOrVector, yy, zz) {
        let {x, y, z} = Vector.#unifyArgs(arguments);
        return this.set(this.x + x, this.y + y, this.z + z);
    }

    subtract(xOrVector, yy, zz) {
        let {x, y, z} = Vector.#unifyArgs(arguments);
        return this.set(this.x - x, this.y - y, this.z - z);
    }

    multiply(xOrVector, yy, zz) {
        let {x, y, z} = Vector.#unifyArgs(arguments);
        return this.set(this.x * x, this.y * y, this.z * z);
    }

    divide(xOrVector, yy, zz) {
        let {x, y, z} = Vector.#unifyArgs(arguments);
        return this.set(this.x / x, this.y / y, this.z / z);
    }

    equals(xOrVector, yy, zz) {
        let {x, y, z} = Vector.#unifyArgs(arguments);
        return this.x === x && this.y === y && this.z === z;
    }

    dot(xOrVector, yy, zz) {
        let {x, y, z} = Vector.#unifyArgs(arguments);
        return this.x * x + this.y * y + this.z * z;
    }

    cross(xOrVector, yy, zz) {
        let {x, y, z} = Vector.#unifyArgs(arguments);
        return this.set(
            this.y * z - this.z * y,
            this.z * x - this.x * z,
            this.x * y - this.y * x,
        );
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        let length = this.length();

        return length ? this.divide(length) : this;
    }

    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length()),
        };
    }

    angleTo(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        let theta = Math.atan2(dy, dx);

        theta *= 180 / Math.PI;

        //if (theta < 0) theta += 360; // range [0, 360)
        return theta;
    }

    toArray(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }

    toSymbol() {
        return Symbol.for(`Vector(${this.x},${this.y},${this.z})`);
    }

    static negate(v) {
        return new Vector(-v.x, -v.y, -v.z);
    }

    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static subtract(a, b) {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static multiply(a, b) {
        return new Vector(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    static divide(a, b) {
        return new Vector(a.x / b.x, a.y / b.y, a.z / b.z);
    }

    static cross(a, b) {
        return new Vector(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    static unit(a) {
        let length = a.length();

        return new Vector(
            a.x / length,
            a.y / length,
            a.z / length
        );
    }

    static min(a, b) {
        return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }

    static max(a, b) {
        return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
    }
    
    static fromAngles(theta, phi) {
        return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
    }

    static randomDirection() {
        return this.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
    }

    static lerp(a, b, fraction) {
        return this.fromObject(b).subtract(a).multiply(fraction).add(a);
    }

    static angleBetween(a, b) {
        return this.fromObject(a).angleTo(b);
    }

    static distance(a, b) {
        return this.fromObject(a).subtract(b).length();
    }

    static fromArray(v) {
        return new Vector(v[0], v[1], v[2]);
    }

    static fromObject(v) {
        return new Vector(v.x, v.y, v.z);
    }

    static fromSymbol(symbol) {
        let array = symbol.description.slice(7, -1).split(',').map(parseFloat);

        return this.fromArray(array);
    }

    static from(x, y, z) {
        return new Vector(x, y, z);
    }

    static #unifyArgs(args) {
        if (args.length > 1) {
            return {
                x: args[0] ?? 0,
                y: args[1] ?? 0,
                z: args[2] ?? 0,
            };
        }

        let v = args.length === 1 ? args[0] : 0;

        return v instanceof Vector ? v : { x: v, y: v, z: v };
    }
}