import AbstractEffect from './AbstractEffect.js';

let nextUniqueId = 0;

export default class Feature extends AbstractEffect {

    constructor(owner, props) {
        super(owner, props);
        this.id = nextUniqueId++;
    }
}