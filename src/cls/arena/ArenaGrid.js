import ArenaCell from './ArenaCell.js';
import HexagonUtils from '../util/HexagonUtils.js';

export default class ArenaGrid {

    // Операции с шестиугольной сеткой
    // https://www.redblobgames.com/grids/hexagons

    // ПОИСК ПУТИ:
    // https://www.redblobgames.com/grids/hexagons/#range-obstacles

    constructor() {
        this.cells = new Map();
        this.pawns = new Map();
    }

    addCell(position) {
        let key = position.toSymbol();
        let cell = new ArenaCell(position);

        this.cells.set(key, cell);

        return cell;
    }

    getCell(position) {
        let key = position.toSymbol();

        return this.cells.get(key);
    }

    cellExists(position) {
        let key = position.toSymbol();

        return this.cells.has(key);
    }

    getAllCells() {
        return Array.from(this.cells.values());
    }

    getNeighbors(position) {
        let neighbors = [];

        for (const neighborPosition of HexagonUtils.getNeighborPositions(position)) {
            if (this.cellExists(neighborPosition)) {
                let cell = this.getCell(neighborPosition);

                neighbors.push(cell);
            }
        }

        return neighbors;
    }

    axialDistance(from, to) {
        return HexagonUtils.axialDistance(from, to);
    }
}