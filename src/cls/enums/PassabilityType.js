import Enum from '../util/Enum.js';

export default class PassabilityType extends Enum {
    static WALKING_PASSABLE = new PassabilityType();
    static SOARING_PASSABLE = new PassabilityType();
    static FLYING_PASSABLE = new PassabilityType();
    static IMPASSABLE = new PassabilityType();
    static _ = this.closeEnum();
}