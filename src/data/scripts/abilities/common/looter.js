
export default {
    /** @this Ability */
    apply({pawn, move, path}) {
        let fight = this.fight;
        let moveExecutor = fight.moveExecutor;
        let arena = fight.arena;
        let corpse = arena.getCorpse(move.targetCell.position);

        moveExecutor.makeMovementMove(move, path).then(() => {
            fight.removeCorpse(corpse);

            // TODO: обыскать труп
        });
    },
}