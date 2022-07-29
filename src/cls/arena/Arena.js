import ArenaGrid from './ArenaGrid.js';
import ArenaPassabilityGrid from '../pathfinding/ArenaPassabilityGrid.js';
import AStarSearch from '../pathfinding/AStarSearch.js';
import HexagonUtils from '../util/HexagonUtils.js';

export default class Arena {

    constructor() {
        this.grid = new ArenaGrid();
        this.pawns = new Map();
        this.corpseUnitNames = new Map();
        this.passabilityGrid = new ArenaPassabilityGrid(this);
    }

    getAvailableCells(forPawn, radius) {
        let search = new AStarSearch(this.passabilityGrid, forPawn.position);
        let findOptions = this.createFindPathOptions(forPawn, radius);

        return search
            .findPositions(findOptions)
            .map(position => {
                let cell = this.getCell(position);
                let distance = search.getCostFromStart(position);

                return { cell, distance };
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
                return this.passabilityGrid.isPassable(p);
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

    isCellPassable(position, forPawn = null) {
        let pawn = this.getSquadOrStructure(position);

        return !pawn || pawn === forPawn;
    }



    addPawn(pawn) {
        this.pawns.set(pawn.id, pawn);
    }

    removePawn(pawn) {
        this.pawns.delete(pawn.id);
    }

    getAnyPawn(position) {
        return this.#findPawn(position);
    }

    getSquadOrStructure(position) {
        return this.#findPawn(position, pawn => pawn.isSquad || pawn.isStructure);
    }

    getSquad(position) {
        return this.#findPawn(position, pawn => pawn.isSquad);
    }

    getStructure(position) {
        return this.#findPawn(position, pawn => pawn.isStructure);
    }

    getItem(position) {
        return this.#findPawn(position, pawn => pawn.isItem);
    }

    hasPawnAt(position) {
        return !!this.getAnyPawn(position);
    }

    getAllPawns() {
        return Array.from(this.pawns.values());
    }



    setCorpse(position, corpsePawn, unitName) {
        let existingCorpse = this.getCorpse(position);

        if (existingCorpse) {
            this.removeCorpse(existingCorpse);
        }

        this.addPawn(corpsePawn);
        this.corpseUnitNames.set(corpsePawn.id, unitName);
    }

    removeCorpse(corpsePawn) {
        this.removePawn(corpsePawn);
        this.corpseUnitNames.delete(corpsePawn.id);
    }

    getCorpse(position) {
        return this.#findPawn(position, pawn => pawn.isCorpse);
    }

    hasCorpseAt(position) {
        return !!this.getCorpse(position);
    }

    getCorpseUnitName(corpsePawn) {
        return this.corpseUnitNames.get(corpsePawn.id);
    }



    getNeighborPositions(originPosition) {
        return this.grid.getNeighborPositions(originPosition);
    }

    getNeighborCell(originCell, angle) {
        let neighborDirection = HexagonUtils.angleToDirection(angle);
        let neighborPosition = originCell.position.add(neighborDirection);

        return this.getCell(neighborPosition);
    }

    #findPawn(position, filter) {
        filter ??= () => true;
        return this.getAllPawns().find(pawn => {
            return pawn.position.equals(position) && filter(pawn);
        });
    }
}