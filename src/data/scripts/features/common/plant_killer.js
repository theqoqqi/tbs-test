
export default {
    /** @this Feature */
    outcomingDamageModifier({attacker, victim, ability, damageRanges}) {

        if (victim.hasFeature('plant')) {
            damageRanges = damageRanges.mapValues(damage => damage * this.scriptParams.multiplier);
        }

        return damageRanges;
    }
}