import Enum from '../util/Enum.js';

export default class HitbackFrequency extends Enum {
    static NEVER = new HitbackFrequency();
    static ONCE_PER_ROUND = new HitbackFrequency();
    static ALWAYS = new HitbackFrequency();
    static _ = this.closeEnum();
}