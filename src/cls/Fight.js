import ArenaPawn from './arena/ArenaPawn.js';
import Arena from './arena/Arena.js';
import Vector from './util/Vector.js';
import arenaData from '../data/json/arenas/generic_with_obstacles.json';
import ArenaTeam from './arena/ArenaTeam.js';
import PassabilityType from './enums/PassabilityType.js';
import Formulas from './Formulas.js';
import AbilitySlot from './enums/AbilitySlot.js';
import ArenaMove from './arena/ArenaMove.js';
import MoveInfo from './util/MoveInfo.js';
import HitInfo from './util/HitInfo.js';
import Gamecycle from './Gamecycle.js';
import HexagonUtils from './util/HexagonUtils.js';

export default class Fight {

    #gamecycle;

    constructor(gameContext) {
        this.arena = new Arena();
        this.#gamecycle = new Gamecycle(this);

        for (const cellData of arenaData.cells) {
            if (cellData['obstacles'] === 'IMPASSABLE') {
                continue;
            }

            let cell = this.addCell(...cellData['position']);

            if (cellData.passability) {
                cell.passability = PassabilityType.enumValueOf(cellData.passability);
            }
        }

        this.pawnRegistry = gameContext.pawnRegistry;

        this.createPawn(Vector.from(-1, -1), 'walker', {
            team: ArenaTeam.DEFAULT_1,
            stackSize: 250,
        });
        this.createPawn(Vector.from(-2, 1), 'soarer', {
            team: ArenaTeam.DEFAULT_1,
            stackSize: 100,
        });
        this.createPawn(Vector.from(-3, 0), 'archer', {
            team: ArenaTeam.DEFAULT_1,
            stackSize: 20,
        });
        this.createPawn(Vector.from(2, -1), 'walker', {
            team: ArenaTeam.DEFAULT_2,
            stackSize: 150,
        });
        this.createPawn(Vector.from(1, 1), 'dragon', {
            team: ArenaTeam.DEFAULT_2,
            stackSize: 1,
        });
    }

    start() {
        this.#gamecycle.nextTurn();
    }

    nextTurn() {
        this.#gamecycle.nextTurn();
    }

    get currentPawn() {
        return this.#gamecycle.currentPawn;
    }

    getAvailableMoves(forPawn, ability) {
        let moves = this.#getMovementMoves(forPawn);

        if (ability) {
            let abilityMoves = this.#getAbilityMoves(forPawn, ability, moves);

            moves = moves.concat(abilityMoves);
        }

        return moves;
    }

    #getMovementMoves(forPawn) {
        let searchResults = this.arena.getAvailableCells(forPawn, forPawn.speed);

        return searchResults.map(searchResult => {
            let { cell, distance } = searchResult;

            return new ArenaMove({
                pawn: forPawn,
                targetCell: cell,
                actionPoints: distance,
                isRanged: false,
            });
        });
    }

    #getAbilityMoves(forPawn, ability, movementMoves) {
        return ability.targetCollector(forPawn, ability, this, this.arena, movementMoves);
    }

    getMoveInfo(attackerPawn, targetPawn, ability) {
        return new MoveInfo({
            actionInfos: [
                this.getEstimatedDamage(attackerPawn, targetPawn, ability),
            ],
        });
    }

    getEstimatedDamage(attackerPawn, targetPawn, ability) {
        let damageRanges = this.getEstimatedDamageRanges(attackerPawn, targetPawn, ability);
        let minDamage = damageRanges.combinedMin;
        let maxDamage = damageRanges.combinedMax;
        let minKills = targetPawn.getKillCount(minDamage);
        let maxKills = targetPawn.getKillCount(maxDamage);
        let targetName = targetPawn.props.internalName;

        return new HitInfo({
            targetName,
            minDamage,
            maxDamage,
            minKills,
            maxKills,
        });
    }

    getRandomDamageInfo(attackerPawn, targetPawn, ability) {
        let damageRanges = this.getEstimatedDamageRanges(attackerPawn, targetPawn, ability);
        let isCriticalHit = Math.random() < attackerPawn.criticalHitChance;
        let damage = this.getDamage(attackerPawn, damageRanges, isCriticalHit);

        let kills = targetPawn.getKillCount(damage);

        return {
            kills,
            damage,
            isCriticalHit,
        };
    }

    getDamage(attackerPawn, damageRanges, isCriticalHit) {
        if (isCriticalHit) {
            return Math.floor(damageRanges.combinedMax * attackerPawn.criticalHitMultiplier);
        } else {
            return this.randomInt(damageRanges.combinedMin, damageRanges.combinedMax);
        }
    }

    getEstimatedDamageRanges(attackerPawn, targetPawn, ability) {
        return Formulas.calculateDamageRange(attackerPawn, targetPawn, ability);
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    addCell(x, y) {
        return this.arena.addCell(Vector.from(x, y));
    }

    createPawn(position, name, options) {
        let props = this.pawnRegistry.get(name);
        let pawn = new ArenaPawn(position, props, options);

        this.arena.addPawn(pawn);
        this.#gamecycle.addPawn(pawn, false);
    }

    removePawn(pawn) {
        this.arena.removePawn(pawn);
        this.#gamecycle.removePawn(pawn);
    }

    makeMove(move, path, ability) {
        let attacker = move.pawn;
        let cell = move.targetCell;

        if (this.arena.hasPawnAt(cell.position)) {
            let victim = this.arena.getPawn(cell.position);

            return this.moveByPath(attacker, path)
                .then(() => this.attack(attacker, victim, ability))
                .then(() => this.tryHitback(attacker, victim));
        } else {
            return this.moveByPath(attacker, path);
        }
    }

    shouldHitback(attacker, victim) {
        let distance = HexagonUtils.axialDistance(attacker.position, victim.position);

        return victim.canHitback && !attacker.hitbackProtection && distance === 1;
    }

    tryHitback(attacker, victim) {
        if (!this.shouldHitback(attacker, victim)) {
            return Promise.resolve();
        }

        return this.hitback(attacker, victim);
    }

    hitback(attacker, victim) {
        let hitbackAbility = this.getRegularAbility(victim);

        victim.consumeHitback();

        return this.attack(victim, attacker, hitbackAbility);
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

            setTimeout(resolve, 200);
        });
    }

    getRegularAbility(forPawn) {
        return this.getAbilityInSlot(forPawn, AbilitySlot.REGULAR);
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

    hasEnemiesNearby(forPawn) {
        let neighborPositions = this.arena.getNeighborPositions(forPawn.position);

        return neighborPositions.some(position => {
            let otherPawn = this.arena.getPawn(position);

            return otherPawn && this.isOpponents(forPawn, otherPawn);
        });
    }

    attack(attacker, target, ability) {
        return new Promise(resolve => {
            let damageInfo = this.getRandomDamageInfo(attacker, target, ability);

            target.applyDamage(damageInfo.damage);

            if (target.stackSize === 0) {
                this.removePawn(target);
            }

            console.log('Attacked', target.toString(), 'by', attacker.toString());
            console.log('Damage:', damageInfo.damage, 'Kills:', damageInfo.kills, 'Is Crit:', damageInfo.isCriticalHit);

            resolve();
        });
    }

    isOpponents(pawnA, pawnB) {
        return this.isOpponentTeams(pawnA.team, pawnB.team);
    }

    isOpponentTeams(teamA, teamB) {
        return teamA !== teamB;
    }
}