
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

            if (!this.#hasNextPawn()) {
                this.#isGameOver = true;

                return;
            }
        }

        this.#turn++;
        this.#currentPawn = this.#consumeNextPawn();

        console.log('Round:', this.#round, 'Turn:', this.#turn)
    }

    addPawn(pawn, resort) {
        if (resort) {
            this.#pawnsInOrder.push(pawn);
            this.#resort(this.#pawnsInOrder);
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
        }

        this.#resort();
    }

    #resort(pawns) {
        pawns ??= this.#allPawns;

        this.#pawnsInOrder = pawns.sort((a, b) => {
            return Gamecycle.#comparePawns(a, b);
        });
    }

    get #allPawns() {
        return this.#fight.arena.getAllPawns();
    }

    static #comparePawns(a, b) {
        let comparisons = [
            b.initiative - a.initiative,
            b.speed - a.speed,
            b.level - a.level,
            -(b.maxHealth - a.maxHealth),
        ];

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