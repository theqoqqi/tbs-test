import Enum from '../util/Enum.js';

export default class EffectType extends Enum {
    static NEUTRAL = new EffectType();
    static DEBUFF = new EffectType();
    static BUFF = new EffectType();
    static _ = this.closeEnum();
}