import ActionQueue from '../pawns/ActionQueue.js';
import PawnDamageDealtEvent from '../events/types/PawnDamageDealtEvent.js';
import PawnDamageReceivedEvent from '../events/types/PawnDamageReceivedEvent.js';

export default class MoveExecutor {

    #fight;

    #eventBus;

    #queuedActions;

    constructor(fight, eventBus) {
        this.#fight = fight;
        this.#eventBus = eventBus;
        this.#queuedActions = new ActionQueue(this.#eventBus);
    }

    makeMove(move, path, ability) {
        return this.applyAbility(move.pawn, ability, move, path);
    }

    makeDefenceMove(pawn) {
        return this.#enqueueAction(resolve => {
            pawn.consumeAllActionPoints();

            this.#fight.addPawnEffect(pawn, 'blockBonus', {
                duration: 1,
            });

            resolve();
        });
    }

    applyAbility(pawn, ability, move = null, path = []) {
        if (!ability?.apply) {
            return Promise.resolve();
        }

        return this.#enqueueAction(resolve => {
            ability.apply({
                pawn,
                move,
                path,
            });

            ability.consumeCharges(1);
            ability.startReloading();

            resolve();
        });
    }

    makeMovementMove(move, path) {
        return this.moveByPath(move.pawn, path);
    }

    makeAttackMove(move, path, ability) {
        let attacker = move.pawn;
        let cell = move.targetCell;
        let victim = this.#fight.arena.getPawn(cell.position);

        return this.moveByPath(attacker, path)
            .then(() => this.attack(attacker, victim, ability))
            .then(() => this.tryHitback(attacker, victim, ability));
    }

    static shouldHitback(attacker, victim, ability) {
        return victim.stackSize > 0 && victim.canHitback && !attacker.hitbackProtection && !ability.noHitbacks;
    }

    tryHitback(attacker, victim, attackerAbility) {
        return this.#enqueueAction(resolve => {
            if (MoveExecutor.shouldHitback(attacker, victim, attackerAbility)) {
                this.#hitback(attacker, victim);
            }

            resolve();
        });
    }

    #hitback(attacker, victim) {
        return this.#enqueueAction(resolve => {
            let hitbackAbility = this.#fight.getRegularAbility(victim);

            victim.consumeHitback();

            this.attack(victim, attacker, hitbackAbility, false);

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

    #stepTo(pawn, position) {
        return this.#enqueueAction(resolve => {
            pawn.position = position;
            pawn.consumeActionPoints(1);

            setTimeout(resolve, 200);
        });
    }

    makeDamageMove({attacker, victim, ability, hitInfo}) {
        return this.#enqueueAction(resolve => {
            this.#applyDamage({attacker, victim, ability, hitInfo});

            setTimeout(resolve, 500);
        })
    }

    attack(attacker, victim, ability, consumeActionPoints = true) {
        return this.#enqueueAction(resolve => {
            let hitInfo = this.#fight.getRandomHitInfo(attacker, victim, ability);

            this.#applyDamage({
                attacker,
                victim,
                ability,
                hitInfo,
            });

            if (victim.stackSize === 0) {
                this.#fight.removePawn(victim);
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