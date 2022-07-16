import AStarSearch from './AStarSearch.js';
import MovementType from '../enums/MovementType.js';
import PassabilityType from '../enums/PassabilityType.js';

export default class ArenaPassabilityGrid {

    constructor(arena) {
        this.arena = arena;
        this.grid = arena.grid;
    }

    cost(from, to) {
        return AStarSearch.heuristic(from, to);
    }

    cellExists(position) {
        return this.grid.cellExists(position);
    }

    isThroughPassable(position, byPawn) {
        let cell = this.arena.getCell(position);

        return (byPawn.movementType === MovementType.FLYING || this.arena.isCellFree(position))
            && ArenaPassabilityGrid.#checkPassability(cell.passability, byPawn.movementType);
    }

    isPassable(position) {
        let cell = this.arena.getCell(position);

        return this.arena.isCellFree(position)
            && ArenaPassabilityGrid.#checkPassability(cell.passability, MovementType.WALKING);
    }

    static #passabilityMap = {
        [MovementType.WALKING]: [
            PassabilityType.WALKING_PASSABLE,
        ],
        [MovementType.SOARING]: [
            PassabilityType.WALKING_PASSABLE,
            PassabilityType.SOARING_PASSABLE,
        ],
        [MovementType.FLYING]: [
            PassabilityType.WALKING_PASSABLE,
            PassabilityType.SOARING_PASSABLE,
            PassabilityType.FLYING_PASSABLE,
        ],
    };

    static #checkPassability(passabilityType, movementType) {
        return this.#passabilityMap[movementType]?.includes(passabilityType) ?? false;
    }
}