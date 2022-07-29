import ArenaMove from '../../../../cls/arena/ArenaMove.js';

export default {
    /** @this Ability */
    targetCollector({movementMoves}) {
        let arena = this.fight.arena;

        return arena.getAllPawns()
            .filter(pawn => pawn.isCorpse)
            .filter(pawn => arena.isCellPassable(pawn.position, this.owner))
            .map(pawn => new ArenaMove({
                pawn: this.owner,
                targetCell: arena.getCell(pawn.position),
                actionPoints: 0,
                isRanged: false,
            }))
            .filter(move => move !== null);
    },
}