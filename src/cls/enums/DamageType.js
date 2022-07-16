import Enum from '../util/Enum.js';

export default class DamageType extends Enum {

    static PHYSICAL = new DamageType();
    static POISON = new DamageType();
    static MAGIC = new DamageType();
    static FIRE = new DamageType();
    static ASTRAL = new DamageType();
    static _ = this.closeEnum();
}