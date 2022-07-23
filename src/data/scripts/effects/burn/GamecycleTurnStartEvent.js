import Ranges from '../../../../cls/util/Ranges.js';
import DamageType from '../../../../cls/enums/DamageType.js';

export default function onGamecycleTurnStart(event) {

    let fight = this.fight;
    let pawn = this.pawn;

    if (fight.currentPawn !== pawn) {
        return;
    }

    let damageRanges = new Ranges([
        [DamageType.FIRE, pawn.stackHealth * 0.04, pawn.stackHealth * 0.06],
    ]);
    let hitInfo = fight.getRandomHitInfoForDamageRanges(pawn, damageRanges);

    fight.applyDamage({
        victim: pawn,
        hitInfo
    });
}