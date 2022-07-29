import ArenaMove from '../../../../cls/arena/ArenaMove.js';

export default {
    /** @this Ability */
    targetCollector({movementMoves}) {
        let fight = this.fight;
        let arena = fight.arena;
        let forPawn = this.owner;
        let allPawns = arena.getAllPawns();

        return allPawns
            .flatMap(targetPawn => {
                if (targetPawn.unitName !== 'chest') {
                    return [];
                }

                let neighborPositions = arena.getNeighborPositions(targetPawn.position);

                return neighborPositions
                    .map(position => {
                        if (!arena.isCellPassable(position)) {
                            return null;
                        }

                        let cell = arena.getCell(position);

                        return new ArenaMove({
                            pawn: forPawn,
                            targetCell: cell,
                            actionPoints: 1,
                            isRanged: true,
                        });
                    })
                    .filter(move => move !== null);
            });
    },
    /** @this Ability */
    apply({pawn, move, path}) {
        this.fight.makeTeleportMove(move, this);
    },
}