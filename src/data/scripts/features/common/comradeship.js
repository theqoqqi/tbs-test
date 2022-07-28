import PawnProps from '../../../../cls/pawns/props/PawnProps.js';

export default {
    /** @this Feature */
    modifyPawnProperty({propertyName, value}) {

        let max = this.scriptParams.maxBonus;
        let unitsPerBonus = this.scriptParams.unitsPerBonus;

        if (propertyName === PawnProps.attack) {
            value += Math.min(max, Math.floor(this.owner.stackSize / unitsPerBonus));
        }

        return value;
    }
}