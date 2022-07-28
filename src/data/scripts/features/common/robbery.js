import PawnProps from '../../../../cls/pawns/props/PawnProps.js';

export default {
    /** @this Feature */
    modifyOtherPawnProperty({pawn, propertyName, value}) {

        if (propertyName !== PawnProps.morale) {
            return value;
        }

        let shouldDebuff = this.fight.isAllies(this.owner, pawn)
            && ['human'].includes(pawn.baseRace.name)
            && [1, 2].includes(pawn.baseLevel);

        if (shouldDebuff) {
            value -= 1;
        }

        return value;
    }
}