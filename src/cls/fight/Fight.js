import Arena from '../arena/Arena.js';
import EventBus from '../events/EventBus.js';
import arenaData from '../../data/json/arenas/generic_with_obstacles.json';
import PassabilityType from '../enums/PassabilityType.js';
import Vector from '../util/Vector.js';
import ArenaMove from '../arena/ArenaMove.js';
import Formulas from '../Formulas.js';
import AbilitySlot from '../enums/AbilitySlot.js';
import Gamecycle from './Gamecycle.js';
import MoveExecutor from './MoveExecutor.js';
import MoveInfo from '../util/info/MoveInfo.js';
import PotentialHitInfo from '../util/info/PotentialHitInfo.js';
import ExactHitInfo from '../util/info/ExactHitInfo.js';
import Pawn from '../pawns/Pawn.js';
import Team from '../pawns/Team.js';
import Effect from '../pawns/Effect.js';
import PawnDamageDealtEvent from '../events/types/PawnDamageDealtEvent.js';
import PawnDamageReceivedEvent from '../events/types/PawnDamageReceivedEvent.js';

export default class Fight {

    #gameContext;

    #eventBus;

    #gamecycle;

    #moveExecutor;

    constructor(gameContext) {
        this.arena = new Arena();
        this.#gameContext = gameContext;
        this.#eventBus = new EventBus();
        this.#gamecycle = new Gamecycle(this, this.#eventBus);
        this.#moveExecutor = new MoveExecutor(this, this.#eventBus);

        for (const cellData of arenaData.cells) {
            if (cellData['obstacles'] === 'IMPASSABLE') {
                continue;
            }

            let cell = this.addCell(...cellData['position']);

            if (cellData.passability) {
                cell.passability = PassabilityType.enumValueOf(cellData.passability);
            }
        }

        this.createPawn(Vector.from(-1, -1), 'walker', {
            team: Team.DEFAULT_1,
            stackSize: 250,
        });
        this.createPawn(Vector.from(-2, 1), 'soarer', {
            team: Team.DEFAULT_1,
            stackSize: 100,
        });
        this.createPawn(Vector.from(-3, 0), 'archer', {
            team: Team.DEFAULT_1,
            stackSize: 50,
        });
        this.createPawn(Vector.from(2, -1), 'walker', {
            team: Team.DEFAULT_2,
            stackSize: 150,
        });
        this.createPawn(Vector.from(1, 1), 'dragon', {
            team: Team.DEFAULT_2,
            stackSize: 1,
        });
    }



    //region События

    on(eventType, callback, context = undefined) {
        this.#eventBus.on(eventType, callback, context);
    }

    off(eventType, callback) {
        this.#eventBus.off(eventType, callback);
    }

    //endregion



    //region Игровой цикл

    start() {
        this.#gamecycle.start();
    }

    #nextTurnIfNoSpeed(pawn) {
        if (pawn.currentSpeed <= 0) {
            this.#nextTurn();
        }
    }

    #nextTurn() {
        this.#gamecycle.nextTurn();
    }

    get currentPawn() {
        return this.#gamecycle.currentPawn;
    }

    //endregion



    //region Информация о ходах

    getAvailableMoves(forPawn, ability) {
        let moves = this.#getMovementMoves(forPawn);

        if (ability) {
            let abilityMoves = this.#getAbilityMoves(forPawn, ability, moves);

            moves = moves.concat(abilityMoves);
        }

        return moves;
    }

    #getMovementMoves(forPawn) {
        let searchResults = this.arena.getAvailableCells(forPawn, forPawn.currentSpeed);

        return searchResults.map(searchResult => {
            let {cell, distance} = searchResult;

            return new ArenaMove({
                pawn: forPawn,
                targetCell: cell,
                actionPoints: distance,
                isRanged: false,
            });
        });
    }

    #getAbilityMoves(forPawn, ability, movementMoves) {
        if (!ability.targetCollector) {
            return [];
        }

        return ability.targetCollector(forPawn, ability, this, this.arena, movementMoves);
    }

    getMoveInfo(attackerPawn, targetPawn, ability) {
        return new MoveInfo({
            actionInfos: [
                this.getEstimatedDamage(attackerPawn, targetPawn, ability),
            ],
        });
    }

    getEstimatedDamage(attacker, victim, ability) {
        let damageRanges = this.getEstimatedDamageRanges(attacker, victim, ability);
        let minDamage = damageRanges.combinedMin;
        let maxDamage = damageRanges.combinedMax;
        let minKills = victim.getKillCount(minDamage);
        let maxKills = victim.getKillCount(maxDamage);
        let willHitback = MoveExecutor.shouldHitback(attacker, victim, ability);
        let targetName = victim.unitName;

        return new PotentialHitInfo({
            targetName,
            minDamage,
            maxDamage,
            minKills,
            maxKills,
            willHitback,
        });
    }

    getRandomHitInfo(attacker, victim, ability) {
        let damageRanges = this.getEstimatedDamageRanges(attacker, victim, ability);
        let isCriticalHit = Math.random() < attacker.criticalHitChance;
        let criticalHitMultiplier = attacker.criticalHitMultiplier;

        return this.getRandomHitInfoForDamageRanges(victim, damageRanges, isCriticalHit, criticalHitMultiplier);
    }

    getRandomHitInfoForDamageRanges(victim, damageRanges, isCriticalHit = false, criticalHitMultiplier = 1) {
        let damage = this.getDamage(damageRanges, isCriticalHit, criticalHitMultiplier);

        return this.createHitInfo(victim, damage, isCriticalHit);
    }

    createHitInfo(victim, damage, isCriticalHit) {
        damage = Math.round(damage); // TODO: Должно ли это происходить здесь?

        let kills = victim.getKillCount(damage);

        return new ExactHitInfo({
            kills,
            damage,
            isCriticalHit,
        });
    }

    getDamage(damageRanges, isCriticalHit = false, criticalHitMultiplier = 1) {
        if (isCriticalHit) {
            return Math.floor(damageRanges.combinedMax * criticalHitMultiplier);
        } else {
            return this.randomInt(damageRanges.combinedMin, damageRanges.combinedMax);
        }
    }

    getEstimatedDamageRanges(attacker, victim, ability) {
        return Formulas.calculateDamageRange(attacker, victim, ability);
    }

    //endregion



    //region Применение ходов

    makeMove(move, path, ability) {
        return this.#moveExecutor.makeMove(move, path, ability)
            .then(() => this.#nextTurnIfNoSpeed(move.pawn));
    }

    makeWaitMove(pawn) {
        return this.#gamecycle.postponeMove(pawn)
            .then(() => this.#nextTurn());
    }

    makeDefenceMove(pawn) {
        return this.#moveExecutor.makeDefenceMove(pawn)
            .then(() => this.#nextTurn());
    }

    applyAbility(pawn, ability) {
        return this.#moveExecutor.applyAbility(pawn, ability);
    }

    applyDamage({attacker, victim, ability, hitInfo}) {
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

    //endregion



    //region Эффекты

    addPawnEffect(pawn, effectName, options) {
        let effectProps = this.#gameContext.getEffectProps(effectName);
        let effect = new Effect(effectProps, options);

        pawn.addEffect(effect);
        effect.start?.({
            pawn,
            fight: this,
        });
    }

    removePawnEffect(pawn, effectName) {
        let effect = pawn.getEffectByName(effectName);

        pawn.removeEffect(effect);
        effect.destroy?.({
            pawn,
            fight: this,
        });
    }

    //endregion



    //region Способности

    getRegularAbility(forPawn) {
        return this.getAbilityInSlot(forPawn, AbilitySlot.REGULAR);
    }

    getReadyAbilities(forPawn, slots = null) {
        slots ??= AbilitySlot.enumValues;

        return slots.map(slot => this.getAbilityInSlot(forPawn, slot))
            .filter(ability => ability);
    }

    getAbilityInSlot(forPawn, abilitySlot) {
        return forPawn.abilities
            .filter(a => a.slot === abilitySlot)
            .find(ability => {
                if (ability.disabledIfNearEnemy) {
                    if (this.hasEnemiesNearby(forPawn)) {
                        return false;
                    }
                }

                return true;
            });
    }

    isAbilityReady(pawn, ability) {
        return !ability.isReloading
            && (!ability.usesCharges || ability.hasCharges)
            && !this.isAbilityMuted(pawn, ability);
    }

    isAbilityMuted(pawn, ability) {
        return ability.mutedIfNearEnemy && this.hasEnemiesNearby(pawn);
    }

    //endregion



    //region Управление ареной

    addCell(x, y) {
        return this.arena.addCell(Vector.from(x, y));
    }

    createPawn(position, unitName, options) {
        let props = this.#gameContext.getPawnProps(unitName);
        let defaultOptions = this.#gameContext.getPawnOptions(unitName);
        let allOptions = Object.assign({}, defaultOptions, options);
        let pawn = new Pawn(unitName, props, allOptions);

        pawn.position = position;

        this.arena.addPawn(pawn);
        this.#gamecycle.addPawn(pawn, false);
    }

    removePawn(pawn) {
        this.arena.removePawn(pawn);
        this.#gamecycle.removePawn(pawn);
    }

    //endregion



    //region Прочее

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    hasEnemiesNearby(forPawn) {
        let neighborPositions = this.arena.getNeighborPositions(forPawn.position);

        return neighborPositions.some(position => {
            let otherPawn = this.arena.getPawn(position);

            return otherPawn && this.isOpponents(forPawn, otherPawn);
        });
    }

    isOpponents(pawnA, pawnB) {
        return this.isOpponentTeams(pawnA.team, pawnB.team);
    }

    isOpponentTeams(teamA, teamB) {
        return teamA !== teamB;
    }

    get moveExecutor() {
        return this.#moveExecutor;
    }

    //endregion
}