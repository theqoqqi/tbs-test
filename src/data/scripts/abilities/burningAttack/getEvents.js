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

            let duration = this.scriptParams.burnDuration;

            fight.ensurePawnEffect(event.victim, 'burn', {
                duration,
            });
        }],
    ];
};