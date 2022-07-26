import ArenaMove from '../../../cls/arena/ArenaMove.js';
import HexagonUtils from '../../../cls/util/HexagonUtils.js';

export default {
    /** @this Ability */
    apply({pawn, move, path}) {
        let arena = this.fight.arena;
        let moveExecutor = this.fight.moveExecutor;

        if (!arena.hasPawnAt(move.targetCell.position)) {
            return moveExecutor.makeMovementMove(move, path);
        }

        return moveExecutor.makeAttackMove(move, path, this);
    },
    /** @this Ability */
    targetCollector({movementMoves}) {
        let fight = this.fight;
        let arena = fight.arena;
        let forPawn = this.owner;
        let allPawns = arena.getAllPawns();

        return allPawns
            .map(targetPawn => {
                if (!fight.isOpponents(forPawn, targetPawn)) {
                    // TODO: проверять в зависимости от способности (вдруг на своих должна применяться?)
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