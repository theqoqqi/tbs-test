import AbilitySlot from '../../../cls/enums/AbilitySlot.js';
import PawnDamageReceivedEvent from '../../../cls/events/types/PawnDamageReceivedEvent.js';

export default {
    /** @this Feature */
    getEvents() {
        return [
            [PawnDamageReceivedEvent, event => {
                let fight = this.fight;
                let owner = this.owner;
                let victim = event.victim;
                let attacker = event.attacker;

                if (victim === owner && fight.moveExecutor.shouldHitback(attacker, victim, event.ability)) {
                    let ability = fight.getAbilityInSlot(owner, AbilitySlot.REGULAR);

                    fight.moveExecutor.attack(victim, attacker, ability, 2);
                }
            }],
        ];
    }
}