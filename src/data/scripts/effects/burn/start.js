import GamecycleTurnStartEvent from '../../../../cls/events/types/GamecycleTurnStartEvent.js';
import Ranges from '../../../../cls/util/Ranges.js';
import DamageType from '../../../../cls/enums/DamageType.js';

export default function start({pawn, fight}) {

    fight.on(GamecycleTurnStartEvent, event => {
        // TODO: Этот слушатель не будет отвязываться сам. Наверное, лучше все сделать,
        //       чтобы слушатели событий находились в отдельных файлах и вызывались
        //       с помощью какого-нибудь глобального слушателя на eventBus'е.

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
    });
}