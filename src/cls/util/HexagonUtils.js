import Vector from './Vector.js';

export default class HexagonUtils {

    static NEIGHBOR_DIRECTIONS = [
        new Vector(1, 0),
        new Vector(1, -1),
        new Vector(0, -1),
        new Vector(-1, 0),
        new Vector(-1, 1),
        new Vector(0, 1),
    ];

    static axialToPlainPosition(position, cellSize, spacing) {
        let {x, y} = position;
        let sqrt3 = Math.sqrt(3);
        let d = (cellSize ?? 1) + (spacing ?? 0);

        return Vector.from(
            d * x + d * y / 2,
            d * y * sqrt3 / 2
        );
    }

    static getNeighborPositions(position) {
        return this.NEIGHBOR_DIRECTIONS.map(direction => {
            return direction.add(position);
        });
    }

    static plainDistance(from, to) {
        let d = Vector.subtract(from, to);

        return HexagonUtils.axialToPlainPosition(d).length();
    }

    static axialDistance(from, to) {
        let {x, y} = Vector.subtract(from, to);

        return (Math.abs(x) + Math.abs(x + y) + Math.abs(y)) / 2;
    }
}