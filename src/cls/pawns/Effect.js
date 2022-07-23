import AbstractEffect from './AbstractEffect.js';

let nextUniqueId = 0;

export default class Effect extends AbstractEffect {

    constructor(owner, props, options) {
        super(owner, props);
        this.id = nextUniqueId++;
    }
}