
export default {
    /** @this Ability */
    apply({pawn, move, path}) {
        pawn.giveActionPoints(this.scriptParams.actionPoints);
        this.fight.removePawn(this.owner);
    }
}