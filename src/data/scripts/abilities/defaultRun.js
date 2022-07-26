
export default {
    /** @this Ability */
    apply({pawn, move, path}) {
        pawn.giveSpeed(this.scriptParams.speed);
    }
}