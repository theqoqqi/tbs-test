import AbilitySlot from '../../../cls/enums/AbilitySlot.js';
import PawnDamageReceivedEvent from '../../../cls/events/types/PawnDamageReceivedEvent.js';
import PawnProps from '../../../cls/pawns/props/PawnProps.js';
import HitbackFrequency from '../../../cls/enums/HitbackFrequency.js';

export default {
    /** @this Feature */
    modifyPawnProperty({propertyName, value}) {

        if (propertyName === PawnProps.hitbackFrequency) {
            return HitbackFrequency.ALWAYS;
        }

        return value;
    },
    /** @this Feature */
    getEvents() {
        return [
            [PawnDamageReceivedEvent, event => {
                let fight = this.fight;
                let owner = this.owner;
                let victim = event.victim;
                let attacker = event.attacker;
                let hitIndex = event.hitInfo.indexInHitChain;
                let isHitbackApplicable = fight.moveExecutor.isHitbackApplicable(attacker, victim, event.ability);

                if (victim === owner && hitIndex === 1 && isHitbackApplicable) {
                    let ability = fight.getAbilityInSlot(owner, AbilitySlot.REGULAR);

                    fight.moveExecutor.attack(victim, attacker, ability, 2);
                }
            }],
        ];
    }
}