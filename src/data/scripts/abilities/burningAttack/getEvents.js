import PawnDamageReceivedEvent from '../../../../cls/events/types/PawnDamageReceivedEvent.js';

/** @this Effect */
export default function getEvents() {
    return [
        [PawnDamageReceivedEvent, event => {
            let fight = this.fight;
            let pawn = this.owner;

            if (event.attacker !== pawn) {
                return;
            }

            fight.addPawnEffect(event.victim, 'burn', {
                duration: this.scriptParams.burnDuration,
            });
        }],
    ];
};