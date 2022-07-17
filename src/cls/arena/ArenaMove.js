
export default class ArenaMove {

    constructor({pawn, targetCell, actionPoints, isRanged}) {
        this.pawn = pawn;
        this.targetCell = targetCell;
        this.actionPoints = actionPoints;
        this.isRanged = isRanged;
    }
}