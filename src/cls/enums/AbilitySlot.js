import Enum from '../util/Enum.js';

export default class AbilitySlot extends Enum {

    static REGULAR = new AbilitySlot();
    static ABILITY_1 = new AbilitySlot();
    static ABILITY_2 = new AbilitySlot();
    static ABILITY_3 = new AbilitySlot();
    static _ = this.closeEnum();
}