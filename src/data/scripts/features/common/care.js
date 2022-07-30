import PawnProps from '../../../../cls/pawns/props/PawnProps.js';

export default {
    /** @this Feature */
    modifyPawnProperty({pawn, propertyName, value}) {

        if (propertyName !== PawnProps.evasionChance) {
            return value;
        }

        let initialStackSize = this.owner.initialStackSize;
        let stackSize = this.owner.stackSize;
        let stackSizeBound = initialStackSize * this.scriptParams.stackSizeFactor;

        if (stackSize <= stackSizeBound) {
            value += this.scriptParams.evasionChance;
        }

        return value;
    }
}