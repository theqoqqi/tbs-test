import HexagonUtils from '../../../../cls/util/HexagonUtils.js';
import ArenaMove from '../../../../cls/arena/ArenaMove.js';

export default function targetCollector(forPawn, ability, fight, arena, movementMoves) {
    let allPawns = arena.getAllPawns();

    return allPawns
        .map(targetPawn => {
            if (!fight.isOpponents(forPawn, targetPawn)) {
                // TODO: проверять в зависимости от способности (вдруг на своих должна применяться?)
                return null;
            }

            let cell = arena.getCell(targetPawn.position);
            let axialDistance = HexagonUtils.axialDistance(forPawn.position, targetPawn.position);

            if (axialDistance < ability.minDistance) {
                return null;
            }

            if (axialDistance > ability.maxDistance && ability.distancePenalty >= 1) {
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
}