
export default function apply(forPawn, ability, fight, arena, movementMoves) {
    forPawn.giveSpeed(ability.params.speed);

    return true;
}