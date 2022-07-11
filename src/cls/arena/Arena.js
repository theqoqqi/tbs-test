import ArenaGrid from './ArenaGrid.js';
import ArenaPassabilityGrid from '../pathfinding/ArenaPassabilityGrid.js';
import AStarSearch from '../pathfinding/AStarSearch.js';
import ArenaMove from './ArenaMove.js';

export default class Arena {

    constructor() {
        this.grid = new ArenaGrid();
        this.pawns = new Map();
        this.passabilityGrid = new ArenaPassabilityGrid(this);
    }

    getAvailableCells(position, radius) {
        let search = new AStarSearch(this.passabilityGrid, position);
        let findOptions = {
            commonPredicate: (p, costFromStart) => {
                return this.passabilityGrid.cellExists(p)
                    && costFromStart <= radius;
            },
            passabilityPredicate: p => {
                return this.passabilityGrid.isPassable(p);
            },
            targetPredicate: p => {
                return this.passabilityGrid.isPassable(p)
                    || this.hasPawnAt(p);
            },
        };

        return search
            .findPositions(findOptions)
            .map(position => this.getCell(position));
    }

    getAvailableMoves(forPawn) {
        let passableCells = this.getAvailableCells(forPawn.position, forPawn.speed);

        return passableCells.map(cell => new ArenaMove(cell));
    }

    findPath(from, to) {
        let search = new AStarSearch(this.passabilityGrid, from, to);

        return search.findPath();
    }

    addCell(position) {
        return this.grid.addCell(position);
    }

    getCell(position) {
        return this.grid.getCell(position);
    }

    getAllCells() {
        return this.grid.getAllCells();
    }

    addPawn(pawn) {
        this.pawns.set(pawn.id, pawn);
    }

    getPawn(position) {
        return this.getAllPawns().find(pawn => {
            return pawn.position.equals(position);
        });
    }

    hasPawnAt(position) {
        return !!this.getPawn(position);
    }

    getAllPawns() {
        return Array.from(this.pawns.values());
    }
}