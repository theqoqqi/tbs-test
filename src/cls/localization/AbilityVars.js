import DamageType from '../enums/DamageType.js';

let damageOfType = (ranges, type) => {
    let values = [
        ranges.getMin(type),
        ranges.getMax(type),
    ];
    return values.join('-');
};

let damage = (ranges) => {
    let values = [
        ranges.combinedMin,
        ranges.combinedMax,
    ];
    return values.join('-');
};

export default class AbilityVars {

    static varTypes = {
        fdamage: ability => damageOfType(ability.damageRanges, DamageType.FIRE),
        pdamage: ability => damageOfType(ability.damageRanges, DamageType.POISON),
        adamage: ability => damageOfType(ability.damageRanges, DamageType.ASTRAL),
        damage: ability => damageOfType(ability.damageRanges, DamageType.PHYSICAL),
        mdamage: ability => damageOfType(ability.damageRanges, DamageType.MAGIC),
        sdamage: ability => damage(ability.damageRanges),
        ap: ability => ability.scriptParams.actionPoints,
    };

    constructor(ability) {
        this.ability = ability;
    }

    get(key) {
        let varType = AbilityVars.varTypes[key];

        if (!varType) {
            if (this.ability.scriptParams[key] !== undefined) {
                return this.ability.scriptParams[key];
            }

            return `[${key}]`;
        }

        return varType(this.ability);
    }

    static from(ability) {
        return new AbilityVars(ability);
    }
}