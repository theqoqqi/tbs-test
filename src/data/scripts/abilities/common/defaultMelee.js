import defaultAttack from './defaultAttack.js';

export default {
    ...defaultAttack,

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