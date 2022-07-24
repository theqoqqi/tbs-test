import GamecycleTurnStartEvent from '../../../../cls/events/types/GamecycleTurnStartEvent.js';
import Ranges from '../../../../cls/util/Ranges.js';
import DamageType from '../../../../cls/enums/DamageType.js';

/** @this Effect */
export default function getEvents() {
    return [
        [GamecycleTurnStartEvent, event => {
            let fight = this.fight;
            let pawn = this.owner;

            if (fight.currentPawn !== pawn) {
                return;
            }

            let damageRanges = Ranges.single(
                DamageType.FIRE,
                pawn.stackHealth * 0.04,
                pawn.stackHealth * 0.06
            );
            let hitInfo = fight.getRandomHitInfoForDamageRanges(pawn, damageRanges);

            fight.applyDamage({
                victim: pawn,
                hitInfo,
            });
        }],
    ];
};