
export default class Gamecycle {

    #fight;

    #round = 0;

    #turn = 0;

    #pawnsInOrder = [];

    #currentPawn = null;

    #isGameOver = false;

    constructor(fight) {
        this.#fight = fight;
    }

    nextTurn() {
        if (!this.#hasNextPawn()) {
            this.#startNextRound();

            // TODO: это условие не будет работать, т.к. всегда остаются выигравшие войска
            if (!this.#hasNextPawn()) {
                this.#isGameOver = true;

                return;
            }
        }

        this.#turn++;
        this.#currentPawn = this.#consumeNextPawn();

        for (const ability of this.#currentPawn.abilities) {
            ability.tickReloading();
        }

        console.log('Round:', this.#round, 'Turn:', this.#turn)
    }

    updateOrder() {
        this.#sortFrom(this.#pawnsInOrder);
    }

    postponeMove(pawn) {
        pawn.setWaiting();
        this.#resort(pawn);

        return Promise.resolve();
    }

    addPawn(pawn, resort) {
        if (resort) {
            this.#pawnsInOrder.push(pawn);
            this.updateOrder();
        }
    }

    removePawn(pawn) {
        let index = this.#pawnsInOrder.indexOf(pawn);

        if (index !== -1) {
            this.#pawnsInOrder.splice(index, 1);
        }
    }

    get currentPawn() {
        return this.#currentPawn;
    }

    get isGameOver() {
        return this.#isGameOver;
    }

    #startNextRound() {
        this.#round++;
        this.#turn = 0;

        for (const pawn of this.#allPawns) {
            pawn.refillSpeed();
            pawn.refillHitbacks();
            pawn.resetWaiting();
        }

        this.#sortFrom(this.#allPawns);
    }

    #sortFrom(pawns) {
        this.#pawnsInOrder = pawns.sort((a, b) => {
            return Gamecycle.#comparePawns(a, b);
        });
    }

    #resort(pawn) {
        this.#pawnsInOrder.push(pawn);
        this.updateOrder();
    }

    get #allPawns() {
        return this.#fight.arena.getAllPawns();
    }

    static #comparePawns(a, b) {
        // Первыми ходят войска с наибольшей инициативой,
        // если она равна, то войска с наибольшей скоростью,
        // либо наибольшим уровнем, либо наименьшим здоровьем.
        // Если все параметры равны, просто сравниваем id.

        let compareBy = [
            pawn => pawn.initiative,
            pawn => pawn.speed,
            pawn => pawn.level,
            pawn => -pawn.maxHealth,
            pawn => pawn.id,
        ];

        let comparisons = compareBy.map(getter => {
            let valueA = a.isWaiting ? -getter(a) : getter(a);
            let valueB = a.isWaiting ? -getter(b) : getter(b);

            return valueB - valueA;
        });

        return comparisons.find(c => c !== 0) ?? 0;
    }

    #consumeNextPawn() {
        if (!this.#hasNextPawn) {
            return null;
        }

        return this.#pawnsInOrder.shift();
    }

    #hasNextPawn() {
        return this.#pawnsInOrder.length > 0;
    }
}