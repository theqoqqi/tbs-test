import ArenaMove from '../../../../cls/arena/ArenaMove.js';

export default {
    /** @this Ability */
    targetCollector({movementMoves}) {
        let arena = this.fight.arena;

        return arena.getAllPawns()
            .filter(pawn => pawn.isCorpse)
            .filter(pawn => arena.isCellPassable(pawn.position, this.owner))
            .filter(pawn => !!movementMoves.find(move => move.targetCell.position.equals(pawn.position)))
            .map(pawn => new ArenaMove({
                pawn: this.owner,
                ability: this,
                targetCell: arena.getCell(pawn.position),
                actionPoints: 0,
                isRanged: false,
            }))
            .filter(move => move !== null);
    },
}