import HexagonUtils from '../util/HexagonUtils.js';
import AStarSearch from './AStarSearch.js';

export default class ArenaPassabilityGrid {

    constructor(arena) {
        this.arena = arena;
        this.grid = arena.grid;
    }

    cost(from, to) {
        return AStarSearch.heuristic(from, to);
    }

    getAvailableNeighbors(position) {
        return HexagonUtils.getNeighborPositions(position)
            .filter(p => this.cellExists(p) && this.isPassable(p));
    }

    cellExists(position) {
        return this.grid.cellExists(position);
    }

    isPassable(position) {
        return !this.arena.hasPawnAt(position);
    }
}