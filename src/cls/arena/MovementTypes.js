import Enum from '../util/Enum.js';

export default class MovementTypes extends Enum {
    static WALKING = new MovementTypes();
    static SOARING = new MovementTypes();
    static FLYING = new MovementTypes();
    static _ = this.closeEnum();
}