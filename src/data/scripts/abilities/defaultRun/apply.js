
export default function apply({pawn, move, path}) {
    pawn.giveSpeed(this.scriptParams.speed);

    return Promise.resolve();
}