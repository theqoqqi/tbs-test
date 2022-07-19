
export default function apply({ability, pawn, move, path, fight, arena, moveExecutor}) {
    if (!arena.hasPawnAt(move.targetCell.position)) {
        return moveExecutor.makeMovementMove(move, path);
    }

    return moveExecutor.makeAttackMove(move, path, ability);
}