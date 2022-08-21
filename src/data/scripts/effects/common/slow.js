import PawnProps from '../../../../cls/pawns/props/PawnProps.js';
import PawnEffectAddedEvent from '../../../../cls/events/types/PawnEffectAddedEvent.js';

export default {
    /** @this Effect */
    propertyBonuses: {
        [PawnProps.actionPoints]: -1,
    },
    /** @this Effect */
    getEvents() {
        return [
            [PawnEffectAddedEvent, event => {
                if (event.effect !== this) {
                    return;
                }

                this.owner.consumeActionPoints(1);
            }],
        ];
    }
}