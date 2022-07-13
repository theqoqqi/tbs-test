import Enum from '../util/Enum.js';

export default class PassabilityTypes extends Enum {
    static WALKING_PASSABLE = new PassabilityTypes();
    static SOARING_PASSABLE = new PassabilityTypes();
    static FLYING_PASSABLE = new PassabilityTypes();
    static IMPASSABLE = new PassabilityTypes();
    static _ = this.closeEnum();
}