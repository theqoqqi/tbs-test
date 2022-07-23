import AbstractEffect from './AbstractEffect.js';

let nextUniqueId = 0;

export default class Effect extends AbstractEffect {

    constructor(props, options) {
        super(props);
        this.id = nextUniqueId++;
    }
}