import Resistances from '../../util/Resistances.js';
import MovementType from '../../enums/MovementType.js';
import HitbackFrequency from '../../enums/HitbackFrequency.js';
import Race from '../Race.js';
import PawnType from '../../enums/PawnType.js';

export default class PawnProps {

    static pawnType = 'pawnType';
    static level = 'level';
    static race = 'race';
    static leadership = 'leadership';
    static morale = 'morale';
    static health = 'health';
    static actionPoints = 'actionPoints';
    static resistances = 'resistances';
    static movementType = 'movementType';
    static initiative = 'initiative';
    static criticalHitChance = 'criticalHitChance';
    static criticalHitMultiplier = 'criticalHitMultiplier';
    static attack = 'attack';
    static defence = 'defence';
    static defenceBonus = 'defenceBonus';
    static evasionChance = 'evasionChance';
    static invulnerable = 'invulnerable';
    static hitbackFrequency = 'hitbackFrequency';
    static hitbackProtection = 'hitbackProtection';

    static propDescriptors = new Map([
        [PawnProps.pawnType, {
            defaultValue: PawnType.SQUAD,
        }],
        [PawnProps.level, {
            defaultValue: 1,
        }],
        [PawnProps.race, {
            defaultValue: new Race(),
        }],
        [PawnProps.leadership, {
            defaultValue: 1,
            postProcessors: [
                PawnProps.minProcessor(1),
                Math.round,
            ],
        }],
        [PawnProps.morale, {
            defaultValue: 0,
            postProcessors: [
                PawnProps.minProcessor(-3),
                PawnProps.maxProcessor(3),
                Math.round,
            ],
        }],
        [PawnProps.health, {
            defaultValue: 1,
            postProcessors: [
                PawnProps.minProcessor(1),
                Math.round,
            ],
        }],
        [PawnProps.actionPoints, {
            defaultValue: 1,
            postProcessors: [
                PawnProps.minProcessor(0),
                Math.round,
            ],
        }],
        [PawnProps.resistances, {
            defaultValue: new Resistances(),
        }],
        [PawnProps.movementType, {
            defaultValue: MovementType.WALKING,
        }],
        [PawnProps.initiative, {
            defaultValue: 1,
            postProcessors: [
                PawnProps.minProcessor(1),
                Math.round,
            ],
        }],
        [PawnProps.criticalHitChance, {
            defaultValue: 0,
            postProcessors: [
                PawnProps.minProcessor(0),
            ],
        }],
        [PawnProps.criticalHitMultiplier, {
            defaultValue: 1.5,
            postProcessors: [
                PawnProps.minProcessor(1),
            ],
        }],
        [PawnProps.attack, {
            defaultValue: 1,
            postProcessors: [
                PawnProps.minProcessor(1),
                Math.round,
            ],
        }],
        [PawnProps.defence, {
            defaultValue: 1,
            postProcessors: [
                PawnProps.minProcessor(1),
                Math.round,
            ],
        }],
        [PawnProps.defenceBonus, {
            defaultValue: 1,
            postProcessors: [
                PawnProps.minProcessor(1),
                Math.round,
            ],
        }],
        [PawnProps.evasionChance, {
            defaultValue: 0,
            postProcessors: [
                PawnProps.minProcessor(0),
                PawnProps.maxProcessor(1),
            ],
        }],
        [PawnProps.invulnerable, {
            defaultValue: false,
        }],
        [PawnProps.hitbackFrequency, {
            defaultValue: HitbackFrequency.ONCE_PER_ROUND,
        }],
        [PawnProps.hitbackProtection, {
            defaultValue: false,
        }],
    ]);

    constructor(props) {
        this.initProps(props);
    }

    initProps(props) {
        for (const propName of PawnProps.propNames) {
            this[propName] = props[propName] ?? null;
        }
    }

    initDefaultValues() {
        for (const propName of PawnProps.propNames) {
            let descriptor = PawnProps.propDescriptors.get(propName);

            this[propName] ??= descriptor.defaultValue;
        }
    }

    get(propertyName) {
        return this[propertyName];
    }

    postProcess(propertyName, value) {
        let descriptor = PawnProps.propDescriptors.get(propertyName);

        if (!descriptor.postProcessors) {
            return value;
        }

        return PawnProps.#applyPostProcessors(value, descriptor.postProcessors);
    }

    static #applyPostProcessors(value, postProcessors) {
        for (const postProcessor of postProcessors) {
            value = postProcessor(value);
        }

        return value;
    }

    static get propNames() {
        return this.propDescriptors.keys();
    }

    static minProcessor(min) {
        return value => {
            return Math.max(min, value);
        };
    }

    static maxProcessor(max) {
        return value => {
            return Math.min(max, value);
        };
    }
}