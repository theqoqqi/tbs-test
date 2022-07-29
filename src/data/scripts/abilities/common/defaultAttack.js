import ArenaMove from '../../../../cls/arena/ArenaMove.js';
import HexagonUtils from '../../../../cls/util/HexagonUtils.js';

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
}