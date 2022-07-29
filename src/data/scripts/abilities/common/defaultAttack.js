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
    getMoveInfo(attackerPawn, targetPawn, move, path) {
        if (targetPawn.isUsable) {
            return new MoveInfo({
                actionInfos: [], // TODO: Действие "Открыть сундук"?
            });
        }

        if (!this.damageRanges) {
            return new MoveInfo({
                actionInfos: [], // TODO: Что вообще делает способность?
            });
        }

        return new MoveInfo({
            actionInfos: [
                this.fight.getEstimatedDamage(attackerPawn, targetPawn, this),
            ],
        });
    },
}