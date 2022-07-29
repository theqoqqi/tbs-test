import ArenaMove from '../../../../cls/arena/ArenaMove.js';
import HexagonUtils from '../../../../cls/util/HexagonUtils.js';
import defaultAttack from './defaultAttack.js';

export default {
    ...defaultAttack,

    /** @this Ability */
    targetCollector({movementMoves}) {
        let fight = this.fight;
        let arena = fight.arena;
        let forPawn = this.owner;
        let allPawns = arena.getAllPawns();

        return allPawns
            .map(targetPawn => {
                if (targetPawn.isItem || targetPawn.invulnerable) {
                    return null;
                }

                if (!fight.isOpponents(forPawn, targetPawn)) {
                    return null;
                }

                let cell = arena.getCell(targetPawn.position);
                let axialDistance = HexagonUtils.axialDistance(forPawn.position, targetPawn.position);

                if (axialDistance < this.minDistance) {
                    return null;
                }

                if (axialDistance > this.maxDistance && this.distancePenalty >= 1) {
                    return null;
                }

                return new ArenaMove({
                    pawn: forPawn,
                    targetCell: cell,
                    actionPoints: 1,
                    isRanged: true,
                });
            })
            .filter(move => move !== null);
    },
}