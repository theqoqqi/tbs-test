import ActionQueue from '../pawns/ActionQueue.js';
import PawnDamageDealtEvent from '../events/types/PawnDamageDealtEvent.js';
import PawnDamageReceivedEvent from '../events/types/PawnDamageReceivedEvent.js';
import PawnMovedEvent from '../events/types/PawnMovedEvent.js';
import AbilitySlot from '../enums/AbilitySlot.js';
import PawnUsedEvent from '../events/types/PawnUsedEvent.js';
import Constants from '../Constants.js';
import HexagonUtils from '../util/HexagonUtils.js';

export default class MoveExecutor {

    #fight;

    #eventBus;

    #queuedActions;

    constructor(fight, eventBus) {
        this.#fight = fight;
        this.#eventBus = eventBus;
        this.#queuedActions = new ActionQueue(this.#eventBus);
    }

    makeMove(move, path) {
        return this.applyAbility(move.pawn, move.ability, move, path);
    }

    makeDefenceMove(pawn) {
        return this.#enqueueAction(resolve => {
            pawn.consumeAllActionPoints();

            this.#fight.addPawnEffect(pawn, Constants.BLOCK_BONUS_EFFECT_NAME, {
                duration: 1,
            });

            resolve();
        });
    }

    applyAbility(pawn, ability, move = null, path = []) {
        if (move?.targetCell) {
            let targetPawn = this.#fight.arena.getSquadOrStructure(move.targetCell.position);

            if (targetPawn?.isUsable) {
                return move && path
                    ? this.makeUseMove(move, path)
                    : Promise.resolve();
            }
        }

        if (!ability?.apply) {
            return move && path
                ? this.makeMovementMove(move, path)
                : Promise.resolve();
        }

        return this.#enqueueAction(resolve => {
            ability.apply({
                pawn,
                move,
                path,
            });

            if (ability.slot !== AbilitySlot.REGULAR) {
                ability.consumeCharges(1);
                ability.startReloading();

                if (move.actionPoints) {
                    move.pawn.consumeActionPoints(move.actionPoints);
                }

                if (ability.endsTurn && move?.pawn) {
                    move.pawn.consumeAllActionPoints();
                }
            }

            resolve();
        });
    }

    makeUseMove(move, path) {
        let targetPawn = this.#fight.arena.getSquadOrStructure(move.targetCell.position);

        return this.makeMovementMove(move, path)
            .then(() => this.use(move.pawn, targetPawn));
    }

    use(usedBy, usedPawn) {
        return this.#enqueueAction(resolve => {
            this.#eventBus.dispatch(PawnUsedEvent, { usedBy, usedPawn });

            usedBy.consumeAllActionPoints();

            resolve();
        });
    }

    makeMovementMove(move, path) {
        return this.moveByPath(move.pawn, path);
    }

    makeTeleportMove(move, ability) {
        return this.teleport(move.pawn, move.targetCell, ability);
    }

    makeAttackMove(move, path, ability) {
        let attacker = move.pawn;
        let cell = move.targetCell;
        let victim = this.#fight.arena.getAnyPawn(cell.position);

        return this.moveByPath(attacker, path)
            .then(() => this.attack(attacker, victim, ability))
            .then(() => this.tryHitback(attacker, victim, ability));
    }

    shouldHitback(attacker, victim, ability) {
        return victim.stackSize > 0
            && victim.canHitback
            && !attacker.hitbackProtection
            && !ability.noHitbacks
            && this.#fight.hasAbilityInSlot(victim, AbilitySlot.REGULAR)
            && HexagonUtils.isNeighbors(attacker.position, victim.position);
    }

    tryHitback(attacker, victim, attackerAbility) {
        return this.#enqueueAction(resolve => {
            if (this.shouldHitback(attacker, victim, attackerAbility)) {
                this.#hitback(attacker, victim);
            }

            resolve();
        });
    }

    #hitback(attacker, victim) {
        return this.#enqueueAction(resolve => {
            let hitbackAbility = this.#fight.getRegularAbility(victim);

            victim.consumeHitback();

            this.attack(victim, attacker, hitbackAbility, 1, false);

            resolve();
        });
    }

    moveByPath(pawn, path) {
        if (path.length === 0) {
            return Promise.resolve();
        }

        let promise = Promise.resolve();

        for (const nextPosition of path.slice(1)) {
            promise = this.#stepTo(pawn, nextPosition);
        }

        return promise;
    }

    #stepTo(pawn, position, consumeActionPoints = true) {
        return this.#enqueueAction(resolve => {
            pawn.position = position;

            if (consumeActionPoints) {
                pawn.consumeActionPoints(1);
            }

            this.#eventBus.dispatch(PawnMovedEvent, { pawn });

            setTimeout(resolve, 200);
        });
    }

    teleport(pawn, cell, ability) {
        return this.#stepTo(pawn, cell.position, ability.slot === AbilitySlot.REGULAR);
    }

    makeDamageMove({attacker, victim, ability, hitInfo}) {
        return this.#enqueueAction(resolve => {
            this.#applyDamage({attacker, victim, ability, hitInfo});

            setTimeout(resolve, 500);
        })
    }

    attack(attacker, victim, ability, indexInHitChain = 0, consumeActionPoints = true) {
        return this.#enqueueAction(resolve => {
            let hitInfo = this.#fight.getRandomHitInfo(attacker, victim, ability);

            hitInfo.indexInHitChain = indexInHitChain;

            this.#applyDamage({
                attacker,
                victim,
                ability,
                hitInfo,
            });

            if (victim.stackSize === 0) {
                this.#fight.removePawn(victim);

                if (victim.isSquad) {
                    this.#fight.createCorpse(victim.position, victim.unitName);
                }
            }

            if (consumeActionPoints) {
                attacker.consumeAllActionPoints();
            }

            setTimeout(resolve, 500);
        });
    }

    #applyDamage({attacker, victim, ability, hitInfo}) {
        victim.applyDamage(hitInfo.damage);

        let eventData = {
            attacker,
            victim,
            ability,
            hitInfo,
        };

        this.#eventBus.dispatch(PawnDamageDealtEvent, eventData);
        this.#eventBus.dispatch(PawnDamageReceivedEvent, eventData);

        console.log('Attacked', victim.toString(), 'by', attacker?.toString());
        console.log('Damage:', hitInfo.damage, 'Kills:', hitInfo.kills, 'Is Crit:', hitInfo.isCriticalHit);
    }

    #enqueueAction(action) {
        return this.#enqueuePromise(() => new Promise(action));
    }

    #enqueuePromise(promiseSupplier) {
        return new Promise(resolve => {
            this.#queuedActions.enqueue(() => {
                return promiseSupplier().then(resolve);
            });
        });
    }

    waitForActions() {
        return this.#queuedActions.getPromise();
    }
}