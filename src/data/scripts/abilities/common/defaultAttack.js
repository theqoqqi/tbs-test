import PawnDamageReceivedEvent from '../../../../cls/events/types/PawnDamageReceivedEvent.js';
import AbilitySlot from '../../../../cls/enums/AbilitySlot.js';

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
    /** @this Effect */
    getEvents() {
        return [
            [PawnDamageReceivedEvent, event => {
                if (event.attacker !== this.owner || event.ability !== this) {
                    return;
                }

                let addEffectIfNeeded = (effectName, target) => {
                    let chance = this.scriptParams[effectName + 'Chance'] ?? 1;
                    let duration = this.scriptParams[effectName + 'Duration'];

                    if (duration && chance >= Math.random()) {
                        this.fight.ensurePawnEffect(target, effectName, {
                            duration,
                        });
                    }
                };

                addEffectIfNeeded('burn', event.victim);
                addEffectIfNeeded('slow', event.victim);
            }],
        ];
    },
}