import ArenaPawn from './arena/ArenaPawn.js';
import Arena from './arena/Arena.js';
import Vector from './util/Vector.js';
import arenaData from '../json/arenas/generic_with_obstacles.json';
import PassabilityTypes from './arena/PassabilityTypes.js';
import ArenaTeam from './arena/ArenaTeam.js';

export default class Fight {

    constructor(gameContext) {
        this.arena = new Arena();

        for (const cellData of arenaData.cells) {
            if (cellData['obstacles'] === 'IMPASSABLE') {
                continue;
            }

            let cell = this.addCell(...cellData['position']);

            if (cellData.passability) {
                cell.passability = PassabilityTypes.enumValueOf(cellData.passability);
            }
        }

        this.pawnRegistry = gameContext.pawnRegistry;

        this.createPawn(Vector.from(-1, -1), 'walker', {
            team: ArenaTeam.DEFAULT_1,
            stackSize: 100,
        });
        this.createPawn(Vector.from(-2, 1), 'soarer', {
            team: ArenaTeam.DEFAULT_1,
            stackSize: 20,
        });
        this.createPawn(Vector.from(2, -1), 'walker', {
            team: ArenaTeam.DEFAULT_2,
            stackSize: 50,
        });
        this.createPawn(Vector.from(1, 1), 'dragon', {
            team: ArenaTeam.DEFAULT_2,
            stackSize: 1,
        });
    }

    getAttackInfo(attackerPawn, targetPawn) {
        return [
            this.getEstimatedDamage(attackerPawn, targetPawn),
        ];
    }

    getEstimatedDamage(attackerPawn, targetPawn) {
        let minDamage = attackerPawn.stackMinDamage;
        let maxDamage = attackerPawn.stackMaxDamage;
        let minKills = targetPawn.getKillCount(minDamage);
        let maxKills = targetPawn.getKillCount(maxDamage);

        return {
            minDamage,
            maxDamage,
            minKills,
            maxKills,
        };
    }

    getRandomDamageInfo(attackerPawn, targetPawn) {
        let estimatedDamage = this.getEstimatedDamage(attackerPawn, targetPawn);
        let damage = this.randomInt(estimatedDamage.minDamage, estimatedDamage.maxDamage);
        let kills = targetPawn.getKillCount(damage);

        return {
            kills,
            damage,
        };
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

    makeMove(move, path) {
        let pawn = move.pawn;
        let cell = move.targetCell;

        if (this.arena.hasPawnAt(cell.position)) {
            let attackedPawn = this.arena.getPawn(cell.position);

            return this.moveByPath(pawn, path)
                .then(() => this.attack(pawn, attackedPawn));
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

    attack(attacker, target) {
        return new Promise(resolve => {
            let damageInfo = this.getRandomDamageInfo(attacker, target);

            target.applyDamage(damageInfo.damage);

            console.log('Attacked', target.toString(), 'by', attacker.toString());
            console.log('Damage:', damageInfo.damage, 'Kills:', damageInfo.kills);

            resolve();
        });
    }
}