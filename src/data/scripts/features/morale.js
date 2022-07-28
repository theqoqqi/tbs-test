import PawnProps from '../../../cls/pawns/props/PawnProps.js';

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

export default {
    /** @this Feature */
    modifyPawnProperty({propertyName, value}) {

        if (propertyName === PawnProps.morale) {
            return value;
        }

        let owner = this.owner;
        let morale = owner.morale;
        let multipliers = moraleBonuses.get(morale);

        if (propertyName === PawnProps.attack) {
            value += owner.baseAttack * (multipliers.attack - 1);
        }

        if (propertyName === PawnProps.defence) {
            value += owner.baseDefence * (multipliers.defence - 1);
        }

        if (propertyName === PawnProps.criticalHitChance) {
            value += owner.baseCriticalHitChance * (multipliers.criticalHitChance - 1);
        }

        return value;
    }
}