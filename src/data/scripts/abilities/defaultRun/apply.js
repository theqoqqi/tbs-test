
export default function apply({ability, pawn, move, path, fight, arena, moveExecutor}) {
    pawn.giveSpeed(ability.scriptParams.speed);

    return Promise.resolve();
}