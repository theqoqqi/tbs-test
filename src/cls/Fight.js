import ArenaPawn from './arena/ArenaPawn.js';
import Arena from './arena/Arena.js';
import Vector from './util/Vector.js';
import arenaData from '../json/arenas/generic_with_obstacles.json';
import ArenaTeam from './arena/ArenaTeam.js';
import PassabilityType from './enums/PassabilityType.js';
import Formulas from './Formulas.js';
import AbilitySlot from './enums/AbilitySlot.js';
import ArenaMove from './arena/ArenaMove.js';

export default class Fight {

    constructor(gameContext) {
        this.arena = new Arena();

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

    getAttackInfo(attackerPawn, targetPawn, ability) {
        return [
            this.getEstimatedDamage(attackerPawn, targetPawn, ability),
        ];
    }

    getEstimatedDamage(attackerPawn, targetPawn, ability) {
        let damageRanges = this.getEstimatedDamageRanges(attackerPawn, targetPawn, ability);
        let minDamage = damageRanges.combinedMin;
        let maxDamage = damageRanges.combinedMax;
        let minKills = targetPawn.getKillCount(minDamage);
        let maxKills = targetPawn.getKillCount(maxDamage);

        return {
            minDamage,
            maxDamage,
            minKills,
            maxKills,
        };
    }

    getRandomDamageInfo(attackerPawn, targetPawn, ability) {
        let damageRanges = this.getEstimatedDamageRanges(attackerPawn, targetPawn, ability);
        let damage = this.randomInt(damageRanges.combinedMin, damageRanges.combinedMax);
        let kills = targetPawn.getKillCount(damage);

        return {
            kills,
            damage,
        };
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
    }

    makeMove(move, path, ability) {
        let pawn = move.pawn;
        let cell = move.targetCell;

        if (this.arena.hasPawnAt(cell.position)) {
            let attackedPawn = this.arena.getPawn(cell.position);

            return this.moveByPath(pawn, path)
                .then(() => this.attack(pawn, attackedPawn, ability));
        } else {
            return this.moveByPath(pawn, path);
        }
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
                return true;
            });
    }

    attack(attacker, target, ability) {
        return new Promise(resolve => {
            let damageInfo = this.getRandomDamageInfo(attacker, target, ability);

            target.applyDamage(damageInfo.damage);

            console.log('Attacked', target.toString(), 'by', attacker.toString());
            console.log('Damage:', damageInfo.damage, 'Kills:', damageInfo.kills);

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