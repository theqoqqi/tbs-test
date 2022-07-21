import BaseEvent from './BaseEvent.js';

export default class PawnDamageDealtEvent extends BaseEvent {

    static get eventName() {
        return 'pawn.damage.received';
    }

    constructor(data) {
        super();
        this.attacker = data.attacker;
        this.victim = data.victim;
        this.ability = data.ability;
        this.hitInfo = data.hitInfo;
    }
}