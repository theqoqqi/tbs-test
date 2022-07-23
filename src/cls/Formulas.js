import Constants from './Constants.js';
import HexagonUtils from './util/HexagonUtils.js';

export default class Formulas {

    static calculateDamageRange = (attacker, victim, ability) => {

        let stackSize = attacker.stackSize;
        let differenceMultiplier = this.#getDifferenceMultiplier(attacker.attack, victim.defence);
        let axialDistance = HexagonUtils.axialDistance(attacker.position, victim.position);
        let penalty = ability.maxDistance && axialDistance > ability.maxDistance ? ability.distancePenalty : 0;

        let damageRanges = ability.damageRanges.map((damageType, min, max) => {
            let resistance = victim.resistances.get(damageType);

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

        attacker.applyCallbacks('outcomingDamageModifier', callback => {
            damageRanges = callback({
                attacker,
                victim,
                ability,
                damageRanges,
            });
        });

        victim.applyCallbacks('incomingDamageModifier', callback => {
            damageRanges = callback({
                attacker,
                victim,
                ability,
                damageRanges,
            });
        });

        return damageRanges.map((type, min, max) => {
            return {
                type: type,
                min: Math.round(min),
                max: Math.round(max),
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