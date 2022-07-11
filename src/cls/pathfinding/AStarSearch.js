import {PriorityQueue} from '@datastructures-js/priority-queue';
import HexagonUtils from '../util/HexagonUtils.js';
import Vector from '../util/Vector.js';

export default class AStarSearch {

    frontier = new PriorityQueue((a, b) => {
        return a.priority < b.priority ? -1 : 1;
    });

    cameFrom = new Map();

    costSoFar = new Map();

    costFromStartMultiplier = 1;

    foundGoal = null;

    constructor(grid, start, goal) {
        this.grid = grid;
        this.start = start;
        this.goal = goal ?? start;
        this.commonPredicate = position => grid.cellExists(position) && grid.isPassable(position);
        this.passabilityPredicate = () => true;
        this.targetPredicate = () => true;

        this.init();
    }

    init() {
        let startKey = this.start.toSymbol();
        // Add the starting location to the frontier with a priority of 0
        this.enqueueFrontier(this.start, 0);
        this.cameFrom.set(startKey, this.start); // is set to start, None in example
        this.costSoFar.set(startKey, 0);
    }

    findPositions({commonPredicate, passabilityPredicate, targetPredicate}) {
        this.commonPredicate = commonPredicate ?? (() => true);
        this.passabilityPredicate = passabilityPredicate ?? (() => true);
        this.targetPredicate = targetPredicate ?? (() => true);

        this.iterateUntilFrontier();

        this.cameFrom.delete(this.start.toSymbol());
        return Array.from(this.cameFrom.keys())
            .map(key => Vector.fromSymbol(key))
            .filter(targetPosition => {
                if (!this.targetPredicate(targetPosition)) {
                    return false;
                }

                let path = this.tryCollectPathFrom(targetPosition);

                if (!path) {
                    return false;
                }

                return path.slice(1, -1).every(this.passabilityPredicate);
            });
    }

    findPath() {
        this.iterateUntilGoal();

        if (!this.foundGoal) {
            return [];
        }

        return this.findPathFromGoal(this.foundGoal);
    }

    iterateUntilFrontier() {

        // add the cross product of the start to goal and tile to goal vectors
        // Vector3 startToGoalV = Vector3.Cross(start.vector3,goal.vector3);
        // Vector2Int startToGoal = new Vector2Int(startToGoalV);
        // Vector3 neighborToGoalV = Vector3.Cross(neighbor.vector3,goal.vector3);

        // frontier is a List of key-value pairs:
        // Vector2Int, (float) priority

        let limit = 1000;

        while (this.frontier.size()) {
            // Get the Vector2Int from the frontier that has the lowest
            // priority, then remove that Vector2Int from the frontier
            let current = this.dequeueFrontier();

            if (limit-- <= 0) {
                throw new Error('Limit exceeded');
            }

            // Это должно быть до выполнения break, чтобы при повторном обращении имелись данные,
            // на основе которых можно было бы продолжить поиск пути.
            this.enqueueNeighbours(current);
        }
    }

    iterateUntilGoal() {

        if (!this.goal) {
            return;
        }

        // add the cross product of the start to goal and tile to goal vectors
        // Vector3 startToGoalV = Vector3.Cross(start.vector3,goal.vector3);
        // Vector2Int startToGoal = new Vector2Int(startToGoalV);
        // Vector3 neighborToGoalV = Vector3.Cross(neighbor.vector3,goal.vector3);

        // frontier is a List of key-value pairs:
        // Vector2Int, (float) priority

        let limit = 1000;

        while (this.frontier.size()) {
            // Get the Vector2Int from the frontier that has the lowest
            // priority, then remove that Vector2Int from the frontier
            let current = this.dequeueFrontier();

            if (limit-- <= 0) {
                throw new Error('Limit exceeded');
            }

            // Это должно быть до выполнения break, чтобы при повторном обращении имелись данные,
            // на основе которых можно было бы продолжить поиск пути.
            this.enqueueNeighbours(current);

            // If we're at the goal Vector2Int, stop looking.
            if (AStarSearch.#equals(this.goal, current)) {
                this.foundGoal = current;
                break;
            }
        }
    }

    enqueueNeighbours(current) {
        let currentKey = current.toSymbol();
        let neighbors = HexagonUtils.getNeighborPositions(current);

        // Neighbors will return a List of valid tile Locations
        // that are next to, diagonal to, above or below current
        for (let neighbor of neighbors) {
            // If neighbor is diagonal to current, grid.cost(current, neighbor)
            // will return Sqrt(2). Otherwise it will return only the cost of
            // the neighbor, which depends on its type, as set in the TileType enum.
            // So if this is a normal floor tile (1) and it's neighbor is an
            // adjacent (not diagonal) floor tile (1), costFromStart will be 2,
            // or if the neighbor is diagonal, 1+Sqrt(2). And that will be the
            // value assigned to costSoFar[neighbor] below.
            let costFromStart = this.costSoFar.get(currentKey) + AStarSearch.heuristic(current, neighbor);

            if (!this.commonPredicate(neighbor, costFromStart)) {
                continue;
            }

            let neighborKey = neighbor.toSymbol();

            // If there's no cost assigned to the neighbor yet, or if the new
            // cost is lower than the assigned one, add costFromStart for this neighbor
            if (this.costSoFar.has(neighborKey) && !(costFromStart < this.costSoFar.get(neighborKey))) {
                continue;
            }

            // If we're replacing the previous cost, remove it
            if (this.costSoFar.has(neighborKey)) {
                this.costSoFar.delete(neighborKey);
                this.cameFrom.delete(neighborKey);
            }

            this.costSoFar.set(neighborKey, costFromStart);
            this.cameFrom.set(neighborKey, current);

            let priority = costFromStart + AStarSearch.heuristic(neighbor, this.goal);
            this.enqueueFrontier(neighbor, priority);
        }
    }

    findPathFromGoal(goal) {
        if (!this.canBeUsedAsGoal(goal)) {
            return [];
        }

        let path = this.tryCollectPathFrom(goal);

        return path ?? [];
    }

    canBeUsedAsGoal(cell) {
        return this.grid.cellExists(cell) && this.grid.isPassable(cell);
    }

    tryCollectPathFrom(position) {
        let path = [];
        let current = position;
        let currentKey = current.toSymbol();

        while (!AStarSearch.#equals(current, this.start)) {
            if (!this.cameFrom.has(currentKey)) {
                return null;
            }

            path.push(current);
            current = this.cameFrom.get(currentKey);
            currentKey = current.toSymbol();
        }

        path.push(this.start);
        path.reverse();

        return path;
    }

    getCostFromStart(position) {
        return this.costSoFar.get(position.toSymbol());
    }

    static heuristic(a, b) {
        // return HexagonUtils.realDistance(a, b);
        return HexagonUtils.axialDistance(a, b);
    }

    enqueueFrontier(position, priority) {
        this.frontier.enqueue({
            priority,
            position,
        });
    }

    dequeueFrontier() {
        return this.frontier.dequeue().position;
    }

    static #equals(a, b) {
        return a.x === b.x && a.y === b.y;
    }
}