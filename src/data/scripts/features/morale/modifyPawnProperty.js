import PawnProps from '../../../../cls/pawns/props/PawnProps.js';

let moraleBonuses = new Map([
    createLevel(-3, 0.5, 0.5, 0),
    createLevel(-2, 0.65, 0.65, 0.5),
    createLevel(-1, 0.8, 0.8, 0.75),
    createLevel(0, 1, 1, 1),
    createLevel(1, 1.1, 1.1, 1.2),
    createLevel(2, 1.2, 1.2, 1.3),
    createLevel(3, 1.3, 1.3, 1.4),
]);

function createLevel(level, attack, defence, criticalHitChance) {
    return [level, { attack, defence, criticalHitChance }];
}

/** @this Feature */
export default function modifyPawnProperty({pawn, propertyName, value}) {

    if (propertyName === PawnProps.morale) {
        return value;
    }

    let morale = this.owner.morale;
    let multipliers = moraleBonuses.get(morale);

    if (propertyName === PawnProps.attack) {
        value *= multipliers.attack;
    }

    if (propertyName === PawnProps.defence) {
        value *= multipliers.defence;
    }

    if (propertyName === PawnProps.criticalHitChance) {
        value *= multipliers.criticalHitChance;
    }

    return value;
}