
export default class ArenaMove {

    constructor({pawn, ability, targetCell, actionPoints, isRanged}) {
        this.pawn = pawn;
        this.ability = ability;
        this.targetCell = targetCell;
        this.actionPoints = actionPoints;
        this.isRanged = isRanged;
    }
}