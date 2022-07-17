import ArenaMove from '../arena/ArenaMove.js';
import HexagonUtils from '../util/HexagonUtils.js';

export default class AbilityTargetCollector {

    static MELEE = (forPawn, ability, fight, arena, movementMoves) => {
        let allPawns = arena.getAllPawns();

        let getMovementMove = neighborPositions => {
            if (neighborPositions.length === 0) {
                return null;
            }

            let sorted = neighborPositions
                .map(position => {
                    return movementMoves.find(move => position.equals(move.targetCell.position));
                })
                .sort((a, b) => {
                    return a.actionPoints - b.actionPoints;
                });

            return sorted[0];
        };

        return allPawns
            .map(targetPawn => {
                if (!fight.isOpponents(forPawn, targetPawn)) {
                    // TODO: проверять в зависимости от способности (вдруг на своих должна применяться?)
                    return null;
                }

                let cell = arena.getCell(targetPawn.position);
                let neighborPositions = arena.getNeighborPositions(targetPawn.position);
                let movementMove = getMovementMove(neighborPositions);

                if (!movementMove) {
                    return null;
                }

                let actionPoints = movementMove.actionPoints + 1;

                if (forPawn.currentSpeed < actionPoints) {
                    return null;
                }

                return new ArenaMove({
                    pawn: forPawn,
                    targetCell: cell,
                    actionPoints,
                    isRanged: false,
                });
            })
            .filter(move => move !== null);
    };

    static RANGED = (forPawn, ability, fight, arena, movementMoves) => {
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
    };
}