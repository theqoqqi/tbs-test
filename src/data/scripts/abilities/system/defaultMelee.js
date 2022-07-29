
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

        return allPawns
            .map(targetPawn => {
                if (targetPawn.isItem) {
                    return null;
                }

                if (!fight.isOpponents(forPawn, targetPawn)) {
                    return null;
                }

                return fight.tryGetMoveForMeleeAction(forPawn, targetPawn, movementMoves);
            })
            .filter(move => move !== null);
    },
}