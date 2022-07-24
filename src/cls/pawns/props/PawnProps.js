import Race from '../../types/Race.js';
import Resistances from '../../util/Resistances.js';
import MovementType from '../../enums/MovementType.js';
import HitbackFrequency from '../../enums/HitbackFrequency.js';

export default class PawnProps {

    static level = 'level';
    static race = 'race';
    static leadership = 'leadership';
    static morale = 'morale';
    static health = 'health';
    static speed = 'speed';
    static resistances = 'resistances';
    static movementType = 'movementType';
    static initiative = 'initiative';
    static criticalHitChance = 'criticalHitChance';
    static criticalHitMultiplier = 'criticalHitMultiplier';
    static attack = 'attack';
    static defence = 'defence';
    static defenceBonus = 'defenceBonus';
    static hitback = 'hitback';
    static hitbackProtection = 'hitbackProtection';

    static propDescriptors = new Map([
        [PawnProps.level, {
            defaultValue: 1,
        }],
        [PawnProps.race, {
            defaultValue: new Race(),
        }],
        [PawnProps.leadership, {
            defaultValue: 1,
        }],
        [PawnProps.morale, {
            defaultValue: 0,
        }],
        [PawnProps.health, {
            defaultValue: 1,
        }],
        [PawnProps.speed, {
            defaultValue: 1,
        }],
        [PawnProps.resistances, {
            defaultValue: new Resistances(),
        }],
        [PawnProps.movementType, {
            defaultValue: MovementType.WALKING,
        }],
        [PawnProps.initiative, {
            defaultValue: 1,
        }],
        [PawnProps.criticalHitChance, {
            defaultValue: 0,
        }],
        [PawnProps.criticalHitMultiplier, {
            defaultValue: 1.5,
        }],
        [PawnProps.attack, {
            defaultValue: 1,
        }],
        [PawnProps.defence, {
            defaultValue: 1,
        }],
        [PawnProps.defenceBonus, {
            defaultValue: 1,
        }],
        [PawnProps.hitback, {
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

    static get propNames() {
        return this.propDescriptors.keys();
    }
}