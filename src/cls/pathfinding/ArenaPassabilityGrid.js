import AStarSearch from './AStarSearch.js';
import PassabilityTypes from '../arena/PassabilityTypes.js';
import MovementTypes from '../arena/MovementTypes.js';

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

        return (byPawn.movementType === MovementTypes.FLYING || this.arena.isCellFree(position))
            && ArenaPassabilityGrid.#checkPassability(cell.passability, byPawn.movementType);
    }

    isPassable(position) {
        let cell = this.arena.getCell(position);

        return this.arena.isCellFree(position)
            && ArenaPassabilityGrid.#checkPassability(cell.passability, MovementTypes.WALKING);
    }

    static #passabilityMap = {
        [MovementTypes.WALKING]: [
            PassabilityTypes.WALKING_PASSABLE,
        ],
        [MovementTypes.SOARING]: [
            PassabilityTypes.WALKING_PASSABLE,
            PassabilityTypes.SOARING_PASSABLE,
        ],
        [MovementTypes.FLYING]: [
            PassabilityTypes.WALKING_PASSABLE,
            PassabilityTypes.SOARING_PASSABLE,
            PassabilityTypes.FLYING_PASSABLE,
        ],
    };

    static #checkPassability(passabilityType, movementType) {
        return this.#passabilityMap[movementType]?.includes(passabilityType) ?? false;
    }
}