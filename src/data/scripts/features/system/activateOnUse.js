import PawnUsedEvent from '../../../../cls/events/types/PawnUsedEvent.js';
import AbilitySlot from '../../../../cls/enums/AbilitySlot.js';

export default {
    /** @this Feature */
    getEvents() {
        return [
            [PawnUsedEvent, event => {
                let fight = this.fight;
                let owner = this.owner;

                if (event.usedPawn === owner) {
                    let ability = fight.getAbilityInSlot(owner, AbilitySlot.REGULAR);

                    if (ability) {
                        fight.applyAbility(event.usedBy, ability);
                    }
                }
            }],
        ];
    }
}