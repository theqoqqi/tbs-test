import ArenaPawn from './arena/ArenaPawn.js';
import Arena from './arena/Arena.js';
import Vector from './util/Vector.js';

export default class Fight {

    constructor(gameContext) {
        this.arena = new Arena();

        this.addCell(-2, -3);
        this.addCell(-1, -3);
        this.addCell(0, -3);
        this.addCell(1, -3);
        this.addCell(2, -3);
        this.addCell(3, -3);
        this.addCell(4, -3);
        this.addCell(5, -3);

        this.addCell(-3, -2);
        this.addCell(-2, -2);
        this.addCell(-1, -2);
        this.addCell(0, -2);
        this.addCell(1, -2);
        this.addCell(2, -2);
        this.addCell(3, -2);
        this.addCell(4, -2);
        this.addCell(5, -2);

        this.addCell(-4, -1);
        this.addCell(-3, -1);
        this.addCell(-2, -1);
        this.addCell(-1, -1);
        this.addCell(0, -1);
        this.addCell(1, -1);
        this.addCell(2, -1);
        this.addCell(3, -1);
        this.addCell(4, -1);
        this.addCell(5, -1);

        this.addCell(-4, 0);
        this.addCell(-3, 0);
        this.addCell(-2, 0);
        this.addCell(-1, 0);
        this.addCell(0, 0);
        this.addCell(1, 0);
        this.addCell(2, 0);
        this.addCell(3, 0);
        this.addCell(4, 0);

        this.addCell(-5, 1);
        this.addCell(-4, 1);
        this.addCell(-3, 1);
        this.addCell(-2, 1);
        this.addCell(-1, 1);
        this.addCell(0, 1);
        this.addCell(1, 1);
        this.addCell(2, 1);
        this.addCell(3, 1);
        this.addCell(4, 1);

        this.addCell(-5, 2);
        this.addCell(-4, 2);
        this.addCell(-3, 2);
        this.addCell(-2, 2);
        this.addCell(-1, 2);
        this.addCell(0, 2);
        this.addCell(1, 2);
        this.addCell(2, 2);
        this.addCell(3, 2);

        this.addCell(-5, 3);
        this.addCell(-4, 3);
        this.addCell(-3, 3);
        this.addCell(-2, 3);
        this.addCell(-1, 3);
        this.addCell(0, 3);
        this.addCell(1, 3);
        this.addCell(2, 3);

        if (true) {
            const shuffleArray = arr => arr
                .map(a => [Math.random(), a])
                .sort((a, b) => a[0] - b[0])
                .map(a => a[1]);

            let keys = Array.from(this.arena.grid.cells.keys());
            keys = shuffleArray(keys);
            keys = keys.slice(0, 20);

            for (const key of keys) {
                this.arena.grid.cells.delete(key);
            }
        }

        this.pawnRegistry = gameContext.pawnRegistry;

        this.createPawn(Vector.from(-4, -1), 'qwer');
        this.createPawn(Vector.from(5, -1), 'asdf');
    }

    addCell(x, y) {
        return this.arena.addCell(Vector.from(x, y));
    }

    createPawn(position, name) {
        let props = this.pawnRegistry.get(name);
        let pawn = new ArenaPawn(position, props);

        this.arena.addPawn(pawn);
    }
}