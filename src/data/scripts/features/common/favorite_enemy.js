import PawnDamageDealtEvent from '../../../../cls/events/types/PawnDamageDealtEvent.js';

let favoritesMap = new Map();

export default {
    /** @this Feature */
    getEvents() {
        return [
            [PawnDamageDealtEvent, event => {
                let attacker = event.attacker;
                let victim = event.victim;

                if (attacker !== this.owner) {
                    return;
                }

                if (!favoritesMap.has(attacker.unitName)) {
                    favoritesMap.set(attacker.unitName, victim.unitName);
                }
            }],
        ];
    },
    /** @this Feature */
    outcomingDamageModifier({attacker, victim, ability, damageRanges}) {

        if (victim.unitName === favoritesMap.get(attacker.unitName)) {
            damageRanges = damageRanges.mapValues(damage => damage * this.scriptParams.multiplier);
        }

        return damageRanges;
    }
}