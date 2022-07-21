import PawnDamageReceivedEvent from './events/types/PawnDamageReceivedEvent.js';
import PawnDamageDealtEvent from './events/types/PawnDamageDealtEvent.js';

export default class MoveExecutor {

    #fight;

    #eventBus;

    constructor(fight, eventBus) {
        this.#fight = fight;
        this.#eventBus = eventBus;
    }

    makeMove(move, path, ability) {
        if (!ability?.apply) {
            return Promise.resolve();
        }

        return this.applyAbility(move.pawn, ability, move, path);
    }

    makeDefenceMove(pawn) {
        pawn.consumeAllSpeed();
        // TODO: применить эффект доп. брони (когда добавлю сами эффекты)

        return Promise.resolve();
    }

    applyAbility(pawn, ability, move = null, path = []) {
        if (!ability?.apply) {
            return Promise.resolve();
        }

        return ability
            .apply({
                fight: this.#fight,
                arena: this.#fight.arena,
                moveExecutor: this.#fight.moveExecutor,
                ability,
                pawn,
                move,
                path,
            })
            .then(() => {
                ability.consumeCharges(1);
                ability.startReloading();
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
        return victim.canHitback && !attacker.hitbackProtection && !ability.noHitbacks;
    }

    tryHitback(attacker, victim, attackerAbility) {
        if (victim.stackSize === 0) {
            return Promise.resolve();
        }

        if (!MoveExecutor.shouldHitback(attacker, victim, attackerAbility)) {
            return Promise.resolve();
        }

        return this.#hitback(attacker, victim);
    }

    #hitback(attacker, victim) {
        let hitbackAbility = this.#fight.getRegularAbility(victim);

        victim.consumeHitback();

        return this.attack(victim, attacker, hitbackAbility, false);
    }

    moveByPath(pawn, path) {
        if (path.length === 0) {
            return Promise.resolve();
        }

        let promise = Promise.resolve();

        for (const nextPosition of path.slice(1)) {
            promise = promise.then(() => this.#stepTo(pawn, nextPosition));
        }

        return promise;
    }

    #stepTo(pawn, position) {
        return new Promise(resolve => {
            pawn.position = position;
            pawn.consumeSpeed(1);

            setTimeout(resolve, 200);
        });
    }

    attack(attacker, victim, ability, consumeSpeed = true) {
        return new Promise(resolve => {
            let hitInfo = this.#fight.getRandomHitInfo(attacker, victim, ability);

            this.#applyDamage(attacker, victim, ability, hitInfo);

            if (victim.stackSize === 0) {
                this.#fight.removePawn(victim);
            }

            if (consumeSpeed) {
                attacker.consumeAllSpeed();
            }

            setTimeout(resolve, 500);
        });
    }

    #applyDamage(attacker, victim, ability, hitInfo) {
        victim.applyDamage(hitInfo.damage);

        let eventData = {
            attacker,
            victim,
            ability,
            hitInfo,
        };

        this.#eventBus.dispatch(PawnDamageDealtEvent, eventData);
        this.#eventBus.dispatch(PawnDamageReceivedEvent, eventData);

        console.log('Attacked', victim.toString(), 'by', attacker.toString());
        console.log('Damage:', hitInfo.damage, 'Kills:', hitInfo.kills, 'Is Crit:', hitInfo.isCriticalHit);
    }
}