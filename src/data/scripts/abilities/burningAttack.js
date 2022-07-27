import PawnDamageReceivedEvent from '../../../cls/events/types/PawnDamageReceivedEvent.js';
import AbilitySlot from '../../../cls/enums/AbilitySlot.js';

export default {
    /** @this Effect */
    getEvents() {
        return [
            [PawnDamageReceivedEvent, event => {
                let fight = this.fight;
                let pawn = this.owner;

                if (event.attacker !== pawn || event.ability.slot !== AbilitySlot.REGULAR) {
                    return;
                }

                let duration = this.scriptParams.burnDuration;

                fight.ensurePawnEffect(event.victim, 'burn', {
                    duration,
                });
            }],
        ];
    }
}