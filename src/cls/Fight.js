import ArenaPawn from './arena/ArenaPawn.js';
import Arena from './arena/Arena.js';
import Vector from './util/Vector.js';
import arenaData from '../json/arenas/generic_with_obstacles.json';
import PassabilityTypes from './arena/PassabilityTypes.js';

export default class Fight {

    constructor(gameContext) {
        this.arena = new Arena();

        for (const cellData of arenaData.cells) {
            if (cellData['obstacles'] === 'IMPASSABLE') {
                continue;
            }

            let cell = this.addCell(...cellData['position']);

            if (cellData.passability) {
                cell.passability = PassabilityTypes[cellData.passability];
            }
        }

        this.pawnRegistry = gameContext.pawnRegistry;

        // this.createPawn(Vector.from(1, 0), 'walker');
        // this.createPawn(Vector.from(1, -1), 'soarer');
        this.createPawn(Vector.from(-4, -1), 'walker');
        this.createPawn(Vector.from(5, -1), 'soarer');
        this.createPawn(Vector.from(4, 1), 'dragon');
    }

    addCell(x, y) {
        return this.arena.addCell(Vector.from(x, y));
    }

    createPawn(position, name) {
        let props = this.pawnRegistry.get(name);
        let pawn = new ArenaPawn(position, props);

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
            target.applyDamage(attacker.damage);

            console.log('Attacked', target.toString(), 'by', attacker.toString());

            resolve();
        });
    }
}