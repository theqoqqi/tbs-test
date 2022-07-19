
export default class MoveExecutor {

    #fight;

    constructor(fight) {
        this.#fight = fight;
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

    attack(attacker, target, ability, consumeSpeed = true) {
        return new Promise(resolve => {
            let damageInfo = this.#fight.getRandomDamageInfo(attacker, target, ability);

            target.applyDamage(damageInfo.damage);

            if (target.stackSize === 0) {
                this.#fight.removePawn(target);
            }

            if (consumeSpeed) {
                attacker.consumeAllSpeed();
            }

            console.log('Attacked', target.toString(), 'by', attacker.toString());
            console.log('Damage:', damageInfo.damage, 'Kills:', damageInfo.kills, 'Is Crit:', damageInfo.isCriticalHit);

            setTimeout(resolve, 500);
        });
    }
}