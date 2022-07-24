import PawnProps from '../../../../cls/pawns/props/PawnProps.js';

/** @this Effect */
export default function modifyPawnProperty({pawn, propertyName, value}) {

    if (propertyName === PawnProps.defence) {
        value += this.owner.getProperty(PawnProps.defenceBonus);
    }

    return value;
}