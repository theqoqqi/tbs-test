import ArenaGrid from './ArenaGrid.js';
import ArenaPassabilityGrid from '../pathfinding/ArenaPassabilityGrid.js';
import AStarSearch from '../pathfinding/AStarSearch.js';

export default class Arena {

    constructor() {
        this.grid = new ArenaGrid();
        this.pawns = new Map();
        this.passabilityGrid = new ArenaPassabilityGrid(this);
    }

    getNeighborCells(cell) {
        return this.grid.getNeighbors(cell.position);
    }

    getPassableCells(cell, radius) {
        let search = new AStarSearch(this.passabilityGrid, cell);

        return search.findPassablePositions(radius)
            .map(position => this.getCell(position));
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