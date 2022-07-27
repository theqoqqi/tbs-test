import ArenaMove from '../../../cls/arena/ArenaMove.js';

export default {
    /** @this Ability */
    apply({pawn, move, path}) {
        let arena = this.fight.arena;
        let moveExecutor = this.fight.moveExecutor;
        let victim = arena.getPawn(move.targetCell.position);

        if (victim && !victim.isItem) {
            moveExecutor.makeAttackMove(move, path, this);
        } else {
            moveExecutor.makeMovementMove(move, path);
        }
    },
    /** @this Ability */
    targetCollector({movementMoves}) {
        let fight = this.fight;
        let arena = fight.arena;
        let forPawn = this.owner;
        let allPawns = arena.getAllPawns();

        let getMovementMove = neighborPositions => {
            if (neighborPositions.length === 0) {
                return null;
            }

            let sorted = neighborPositions
                .map(position => {
                    return position.equals(forPawn.position)
                        || movementMoves.find(move => position.equals(move.targetCell.position));
                })
                .sort((a, b) => {
                    return a.actionPoints - b.actionPoints;
                })
                .filter(move => move !== undefined);

            return sorted[0];
        };

        return allPawns
            .map(targetPawn => {
                if (targetPawn.isItem) {
                    return null;
                }

                if (!fight.isOpponents(forPawn, targetPawn)) {
                    return null;
                }

                let cell = arena.getCell(targetPawn.position);
                let neighborPositions = arena.getNeighborPositions(targetPawn.position);
                let isNearby = neighborPositions.some(position => position.equals(forPawn.position));
                let actionPoints = 1;

                if (!isNearby) {
                    let movementMove = getMovementMove(neighborPositions);

                    if (!movementMove) {
                        return null;
                    }

                    actionPoints += movementMove.actionPoints;
                }

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
    },
}