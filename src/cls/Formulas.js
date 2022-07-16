import Constants from './Constants.js';
import HexagonUtils from './util/HexagonUtils.js';

export default class Formulas {

    static calculateDamageRange = (attackerPawn, targetPawn, ability) => {

        // TODO: Модификаторы min/max урона от эффектов на отряде (только на стандартную атаку)

        let stackSize = attackerPawn.stackSize;
        let differenceMultiplier = this.#getDifferenceMultiplier(attackerPawn.attack, targetPawn.defence);
        let axialDistance = HexagonUtils.axialDistance(attackerPawn.position, targetPawn.position);
        let penalty = axialDistance > ability.maxDistance ? ability.distancePenalty : 0;

        return ability.damageRanges.map((damageType, min, max) => {
            let resistance = targetPawn.resistances.get(damageType);

            let context = {
                stackSize,
                differenceMultiplier,
                penalty,
                resistance
            };

            return {
                type: damageType,
                min: this.#calculateDamage(min, context),
                max: this.#calculateDamage(max, context),
            };
        });
    };

    static #calculateDamage(damage, context) {
        return damage
            * context.stackSize
            * context.differenceMultiplier
            * (1 - context.resistance)
            * (1 - context.penalty);
    }

    static #getDifferenceMultiplier(attack, defence) {
        let maxDifference = Constants.MAX_ATTACK_DEFENCE_DIFFERENCE;
        let maxMultiplier = Constants.MAX_ATTACK_DEFENCE_DIFFERENCE_MULTIPLIER - 1;
        let rawDifference = attack - defence;

        let difference = Math.min(maxDifference, Math.abs(rawDifference));
        let multiplier = 1 + maxMultiplier * (difference / maxDifference);

        return rawDifference > 0 ? multiplier : 1 / multiplier;
    }
}