
export default function apply({pawn, move, path}) {
    let arena = this.fight.arena;
    let moveExecutor = this.fight.moveExecutor;

    if (!arena.hasPawnAt(move.targetCell.position)) {
        return moveExecutor.makeMovementMove(move, path);
    }

    return moveExecutor.makeAttackMove(move, path, this);
}