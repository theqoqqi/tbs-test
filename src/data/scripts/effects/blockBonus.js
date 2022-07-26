import PawnProps from '../../../cls/pawns/props/PawnProps.js';

export default {
    /** @this Effect */
    modifyPawnProperty({pawn, propertyName, value}) {

        if (propertyName === PawnProps.defence) {
            value += this.owner.getProperty(PawnProps.defenceBonus);
        }

        return value;
    }
}