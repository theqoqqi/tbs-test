import ArenaGrid from './ArenaGrid.js';
import ArenaPassabilityGrid from '../pathfinding/ArenaPassabilityGrid.js';
import AStarSearch from '../pathfinding/AStarSearch.js';
import ArenaMove from './ArenaMove.js';
import HexagonUtils from '../util/HexagonUtils.js';

export default class Arena {

    constructor() {
        this.grid = new ArenaGrid();
        this.pawns = new Map();
        this.passabilityGrid = new ArenaPassabilityGrid(this);
    }

    #getAvailableCells(forPawn, radius) {
        let search = new AStarSearch(this.passabilityGrid, forPawn.position);
        let findOptions = this.createFindPathOptions(forPawn, radius);

        let cells = search
            .findPositions(findOptions)
            .map(position => this.getCell(position));

        return { search, cells };
    }

    getAvailableMoves(forPawn) {
        let { search, cells } = this.#getAvailableCells(forPawn, forPawn.speed);

        return cells.map(cell => {
            let actionPoints = search.getCostFromStart(cell.position);

            return new ArenaMove(forPawn, cell, actionPoints);
        });
    }

    findPath(forPawn, to) {
        let from = forPawn.position;
        let search = new AStarSearch(this.passabilityGrid, from, to);
        let findOptions = this.createFindPathOptions(forPawn);

        return search.findPath(findOptions);
    }

    createFindPathOptions(forPawn, radius = 999) {
        return {
            commonPredicate: (p, costFromStart) => {
                return this.passabilityGrid.cellExists(p)
                    && costFromStart <= radius;
            },
            passabilityPredicate: p => {
                return this.passabilityGrid.isThroughPassable(p, forPawn);
            },
            targetPredicate: p => {
                return this.passabilityGrid.isPassable(p)
                    || this.hasPawnAt(p);
            },
        };
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

    isCellFree(position) {
        return !this.hasPawnAt(position);
    }

    getNeighborCell(originCell, angle) {
        let neighborDirection = HexagonUtils.angleToDirection(angle);
        let neighborPosition = originCell.position.add(neighborDirection);

        return this.getCell(neighborPosition);
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