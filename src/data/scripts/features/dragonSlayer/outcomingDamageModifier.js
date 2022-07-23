
export default function outcomingDamageModifier({attacker, victim, ability, damageRanges}) {

    if (victim.hasFeature('dragon')) {
        damageRanges = damageRanges.map((damageType, min, max) => {
            return {
                type: damageType,
                min: min * this.scriptParams.multiplier,
                max: max * this.scriptParams.multiplier,
            };
        });
    }

    return damageRanges;
}