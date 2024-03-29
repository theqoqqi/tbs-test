import GamecycleStartEvent from '../events/types/GamecycleStartEvent.js';
import GamecycleTurnStartEvent from '../events/types/GamecycleTurnStartEvent.js';
import GamecycleRoundStartEvent from '../events/types/GamecycleRoundStartEvent.js';
import GamecycleGameOverEvent from '../events/types/GamecycleGameOverEvent.js';

export default class Gamecycle {

    #fight;

    #eventBus;

    #round = 0;

    #turn = 0;

    #pawnsInOrder = [];

    #currentPawn = null;

    #isGameOver = false;

    #winner = null;

    constructor(fight, eventBus) {
        this.#fight = fight;
        this.#eventBus = eventBus;
    }

    start() {
        this.#eventBus.dispatch(GamecycleStartEvent);
        this.nextTurn();
    }

    nextTurn() {
        this.#checkGameOver();

        if (this.#isGameOver) {
            this.#currentPawn = null;
            return;
        }

        if (!this.#hasNextPawn()) {
            this.#startNextRound();
        }

        this.#turn++;
        this.#currentPawn = this.#consumeNextPawn();

        for (const ability of this.#currentPawn.abilities) {
            ability.tickReloading();
        }

        this.#eventBus.dispatch(GamecycleTurnStartEvent, {
            round: this.#round,
            turn: this.#turn,
        });

        for (const effect of this.#currentPawn.effects) {
            effect.decreaseDuration();
        }

        let expiredEffects = this.#currentPawn.effects.filter(effect => effect.isExpired);

        for (const effect of expiredEffects) {
            this.#fight.removePawnEffect(this.#currentPawn, effect);
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
        let index = this.getTurnIndex(pawn);

        if (index !== -1) {
            this.#pawnsInOrder.splice(index, 1);
        }
    }

    getTurnIndex(pawn) {
        return this.#pawnsInOrder.indexOf(pawn);
    }

    get currentPawn() {
        return this.#currentPawn;
    }

    get isGameOver() {
        return this.#isGameOver;
    }

    get winner() {
        return this.#winner;
    }

    #checkGameOver() {
        let aliveTeams = this.#findAliveTeams();

        if (aliveTeams.length <= 1) {
            this.#isGameOver = true;
            this.#winner = aliveTeams[0] ?? null;

            this.#eventBus.dispatch(GamecycleGameOverEvent);

            console.log('Game over. Winner:', this.#winner);
        }
    }

    #findAliveTeams() {
        let teams = new Set();

        for (let pawn of this.#allPawns) {
            if (pawn.team.isContender) {
                teams.add(pawn.team);
            }
        }

        return Array.from(teams.values());
    }

    #startNextRound() {
        this.#round++;
        this.#turn = 0;

        for (const pawn of this.#allPawns) {
            pawn.refillActionPoints();
            pawn.refillHitbacks();
            pawn.resetWaiting();
        }

        this.#sortFrom(this.#allPawns);

        this.#eventBus.dispatch(GamecycleRoundStartEvent, {
            round: this.#round,
        });
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
        return this.#fight.arena.getAllPawns()
            .filter(pawn => pawn.performsMoves);
    }

    static #comparePawns(a, b) {
        // Первыми ходят войска с наибольшей инициативой,
        // если она равна, то войска с наибольшей скоростью,
        // либо наибольшим уровнем, либо наименьшим здоровьем.
        // Если все параметры равны, просто сравниваем id.

        let compareBy = [
            pawn => pawn.initiative,
            pawn => pawn.maxActionPoints,
            pawn => pawn.level,
            pawn => -pawn.maxHealth,
            pawn => pawn.id,
        ];

        let comparisons = compareBy.map(getter => {
            let valueA = a.isWaiting ? -getter(a) : getter(a);
            let valueB = b.isWaiting ? -getter(b) : getter(b);

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