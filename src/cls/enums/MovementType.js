import Enum from '../util/Enum.js';

export default class MovementType extends Enum {
    static IMMOBILE = new MovementType();
    static WALKING = new MovementType();
    static SOARING = new MovementType();
    static FLYING = new MovementType();
    static _ = this.closeEnum();
}