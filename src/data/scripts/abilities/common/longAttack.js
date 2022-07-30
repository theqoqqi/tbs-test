import ArenaMove from '../../../../cls/arena/ArenaMove.js';
import HexagonUtils from '../../../../cls/util/HexagonUtils.js';

export default {
    /** @this Ability */
    targetCollector({movementMoves}) {
        let fight = this.fight;
        let arena = fight.arena;
        let forPawn = this.owner;

        return HexagonUtils.NEIGHBOR_DIRECTIONS
            .map(direction => {
                let middlePosition = direction.add(forPawn.position);
                let targetPosition = direction.multiply(2).add(forPawn.position);

                if (!arena.isCellPassable(middlePosition)) {
                    return null;
                }

                let targetPawn = arena.getSquadOrStructure(targetPosition);

                if (!targetPawn || !fight.isOpponents(forPawn, targetPawn)) {
                    return null;
                }

                let cell = arena.getCell(targetPosition);

                return new ArenaMove({
                    pawn: forPawn,
                    ability: this,
                    targetCell: cell,
                    actionPoints: 1,
                    isRanged: true,
                });
            })
            .filter(move => move !== null);
    },
    /** @this Ability */
    apply({pawn, move, path}) {
        let victim = this.fight.arena.getSquadOrStructure(move.targetCell.position);
        let hitInfo = this.fight.getRandomHitInfo(this.owner, victim, this);

        this.fight.makeDamageMove({
            attacker: this.owner,
            victim,
            ability: this,
            hitInfo
        });
    },
}