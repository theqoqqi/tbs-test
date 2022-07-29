import MoveInfo from '../../../../cls/util/info/MoveInfo.js';

export default {
    /** @this Ability */
    apply({pawn, move, path}) {
        let arena = this.fight.arena;
        let moveExecutor = this.fight.moveExecutor;
        let victim = arena.getSquadOrStructure(move.targetCell.position);

        if (victim) {
            moveExecutor.makeAttackMove(move, path, this);
            move.pawn.consumeAllActionPoints();
        } else {
            moveExecutor.makeMovementMove(move, path);
        }
    },
}