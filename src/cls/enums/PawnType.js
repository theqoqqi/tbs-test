import Enum from '../util/Enum.js';

export default class PawnType extends Enum {

    static SQUAD = new PawnType();
    static STRUCTURE = new PawnType();
    static ITEM = new PawnType();
    static _ = PawnType.closeEnum();
}