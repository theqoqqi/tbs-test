import PawnProps from '../../../cls/pawns/props/PawnProps.js';

export default {
    /** @this Effect */
    modifyPawnProperty({propertyName, value}) {

        if (propertyName === PawnProps.defence) {
            value += this.owner.getProperty(PawnProps.defenceBonus);
        }

        return value;
    }
}