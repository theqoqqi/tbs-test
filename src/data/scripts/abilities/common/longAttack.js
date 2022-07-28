import ArenaMove from '../../../../cls/arena/ArenaMove.js';
import HexagonUtils from '../../../../cls/util/HexagonUtils.js';

export default {
    /** @this Ability */
    targetCollector({movementMoves}) {
        let fight = this.fight;
        let arena = fight.arena;
        let forPawn = this.owner;

        let targetPositions = HexagonUtils.NEIGHBOR_DIRECTIONS.map(position => {
            return position.multiply(2).add(forPawn.position);
        });

        return targetPositions
            .map(position => {
                let targetPawn = arena.getPawn(position);

                if (!targetPawn || !fight.isOpponents(forPawn, targetPawn)) {
                    return null;
                }

                let cell = arena.getCell(position);

                return new ArenaMove({
                    pawn: forPawn,
                    targetCell: cell,
                    actionPoints: 1,
                    isRanged: true,
                });
            })
            .filter(move => move !== null);
    },
    /** @this Ability */
    apply({pawn, move, path}) {
        let hitInfo = this.fight.getRandomHitInfo(this.owner, pawn, this);
        let victim = this.fight.arena.getPawn(move.targetCell.position);

        this.fight.makeDamageMove({
            attacker: this.owner,
            victim,
            ability: this,
            hitInfo
        });
    },
}