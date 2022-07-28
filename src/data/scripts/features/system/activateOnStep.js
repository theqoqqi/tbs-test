import PawnMovedEvent from '../../../../cls/events/types/PawnMovedEvent.js';
import AbilitySlot from '../../../../cls/enums/AbilitySlot.js';

export default {
    /** @this Feature */
    getEvents() {
        return [
            [PawnMovedEvent, event => {
                let fight = this.fight;
                let owner = this.owner;
                let pawn = event.pawn;

                if (pawn.position.equals(owner.position)) {
                    let ability = fight.getAbilityInSlot(owner, AbilitySlot.REGULAR);

                    if (ability) {
                        fight.applyAbility(pawn, ability);
                    }
                }
            }],
        ];
    }
}