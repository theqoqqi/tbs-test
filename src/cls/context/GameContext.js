import MovementType from '../enums/MovementType.js';
import Race from '../types/Race.js';
import Ranges from '../util/Ranges.js';
import DamageType from '../enums/DamageType.js';
import Resistances from '../util/Resistances.js';
import AbilitySlot from '../enums/AbilitySlot.js';
import HitbackFrequency from '../enums/HitbackFrequency.js';
import * as abilityScripts from '../../data/scripts/abilities';
import * as featureScripts from '../../data/scripts/features';
import * as effectScripts from '../../data/scripts/effects';
import AbilityProps from '../pawns/props/AbilityProps.js';
import FeatureProps from '../pawns/props/FeatureProps.js';
import PawnProps from '../pawns/props/PawnProps.js';
import Registry from './Registry.js';
import EffectProps from '../pawns/props/EffectProps.js';

export default class GameContext {

    constructor() {
        this.raceRegistry = new Registry();
        this.featureRegistry = new Registry();
        this.effectRegistry = new Registry();
        this.pawnPropsRegistry = new Registry();
        this.pawnOptionsRegistry = new Registry();

        this.registerRace('demon');
        this.registerRace('dwarf');
        this.registerRace('orc');
        this.registerRace('neutral');
        this.registerRace('elf');
        this.registerRace('human');
        this.registerRace('spirit');
        this.registerRace('lizard');
        this.registerRace('undead');

        this.registerFeature('dragonSlayer', {
            internalName: 'dragonSlayer',
            outcomingDamageModifier: featureScripts.dragonSlayer.outcomingDamageModifier,
            scriptParams: {
                multiplier: 1.5,
            },
        });
        this.registerFeature('dragon', {
            internalName: 'dragon',
        });

        this.registerEffect('burn', {
            internalName: 'burn',
            getEvents: effectScripts.burn.getEvents,
        });

        this.registerTestPawn('walker', {
            [PawnProps.health]: 5,
            [PawnProps.damageRanges]: new Ranges([
                [DamageType.PHYSICAL, 1, 2],
            ]),
            [PawnProps.resistances]: new Resistances([
                [DamageType.MAGIC, 0.25],
            ]),
            [PawnProps.speed]: 2,
            [PawnProps.movementType]: MovementType.WALKING,
            [PawnProps.level]: 1,
            [PawnProps.race]: this.raceRegistry.get('neutral'),
            [PawnProps.leadership]: 8,
            [PawnProps.initiative]: 3,
            [PawnProps.criticalHitChance]: 0.15,
            [PawnProps.attack]: 3,
            [PawnProps.defence]: 1,
            [PawnProps.defenceBonus]: 1,
            [PawnProps.hitback]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: 0,
        }, {
            features: [
                this.featureRegistry.get('dragonSlayer'),
            ],
            abilities: [
                new AbilityProps({
                    slot: AbilitySlot.REGULAR,
                    targetCollector: abilityScripts.defaultMelee.targetCollector,
                    apply: abilityScripts.defaultMelee.apply,
                    damageRanges: new Ranges([
                        [DamageType.PHYSICAL, 1, 2],
                    ]),
                }),
                new AbilityProps({
                    slot: AbilitySlot.ABILITY_1,
                    charges: 1,
                    apply: abilityScripts.defaultRun.apply,
                    scriptParams: {
                        speed: 2,
                    },
                }),
            ],
        });

        this.registerTestPawn('soarer', {
            [PawnProps.health]: 10,
            [PawnProps.resistances]: new Resistances([
                [DamageType.PHYSICAL, 0.5],
            ]),
            [PawnProps.speed]: 3,
            [PawnProps.movementType]: MovementType.SOARING,
            [PawnProps.level]: 1,
            [PawnProps.race]: this.raceRegistry.get('undead'),
            [PawnProps.leadership]: 12,
            [PawnProps.initiative]: 2,
            [PawnProps.criticalHitChance]: 0.08,
            [PawnProps.attack]: 3,
            [PawnProps.defence]: 5,
            [PawnProps.defenceBonus]: 2,
            [PawnProps.hitback]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: 0,
        }, {
            abilities: [
                new AbilityProps({
                    slot: AbilitySlot.REGULAR,
                    targetCollector: abilityScripts.defaultMelee.targetCollector,
                    apply: abilityScripts.defaultMelee.apply,
                    damageRanges: new Ranges([
                        [DamageType.PHYSICAL, 1, 2],
                        [DamageType.MAGIC, 1, 1],
                    ]),
                }),
                new AbilityProps({
                    slot: AbilitySlot.ABILITY_1,
                    targetCollector: abilityScripts.defaultMelee.targetCollector,
                    apply: abilityScripts.defaultMelee.apply,
                    reload: 2,
                    damageRanges: new Ranges([
                        [DamageType.MAGIC, 3, 4],
                    ]),
                }),
            ],
        });

        this.registerTestPawn('archer', {
            [PawnProps.health]: 30,
            [PawnProps.resistances]: new Resistances(),
            [PawnProps.speed]: 2,
            [PawnProps.movementType]: MovementType.WALKING,
            [PawnProps.level]: 2,
            [PawnProps.race]: this.raceRegistry.get('human'),
            [PawnProps.leadership]: 50,
            [PawnProps.initiative]: 5,
            [PawnProps.criticalHitChance]: 0.12,
            [PawnProps.attack]: 15,
            [PawnProps.defence]: 8,
            [PawnProps.defenceBonus]: 2,
            [PawnProps.hitback]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: 0,
        }, {
            abilities: [
                new AbilityProps({
                    slot: AbilitySlot.REGULAR,
                    targetCollector: abilityScripts.defaultRanged.targetCollector,
                    apply: abilityScripts.defaultRanged.apply,
                    damageRanges: new Ranges([
                        [DamageType.PHYSICAL, 4, 5],
                    ]),
                    minDistance: 2,
                    maxDistance: 5,
                    distancePenalty: 0.5,
                    disabledIfNearEnemy: true,
                    noHitbacks: true,
                }),
                new AbilityProps({
                    slot: AbilitySlot.REGULAR,
                    targetCollector: abilityScripts.defaultMelee.targetCollector,
                    apply: abilityScripts.defaultMelee.apply,
                    damageRanges: new Ranges([
                        [DamageType.PHYSICAL, 2, 3],
                    ]),
                }),
                new AbilityProps({
                    slot: AbilitySlot.ABILITY_1,
                    targetCollector: abilityScripts.defaultRanged.targetCollector,
                    apply: abilityScripts.defaultRanged.apply,
                    damageRanges: new Ranges([
                        [DamageType.PHYSICAL, 6, 8],
                    ]),
                    reload: 2,
                    minDistance: 2,
                    maxDistance: 5,
                    distancePenalty: 0.5,
                    mutedIfNearEnemy: true,
                    noHitbacks: true,
                }),
            ],
        });

        this.registerTestPawn('peasant', {
            [PawnProps.health]: 6,
            [PawnProps.resistances]: new Resistances(),
            [PawnProps.speed]: 2,
            [PawnProps.movementType]: MovementType.WALKING,
            [PawnProps.level]: 1,
            [PawnProps.race]: this.raceRegistry.get('human'),
            [PawnProps.leadership]: 5,
            [PawnProps.initiative]: 3,
            [PawnProps.criticalHitChance]: 0.1,
            [PawnProps.attack]: 1,
            [PawnProps.defence]: 1,
            [PawnProps.defenceBonus]: 1,
            [PawnProps.hitback]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: 0,
        }, {
            abilities: [
                new AbilityProps({
                    slot: AbilitySlot.REGULAR,
                    targetCollector: abilityScripts.defaultMelee.targetCollector,
                    apply: abilityScripts.defaultMelee.apply,
                    damageRanges: new Ranges([
                        [DamageType.PHYSICAL, 1, 2],
                    ]),
                }),
            ],
        });

        this.registerTestPawn('dragon', {
            [PawnProps.health]: 800,
            [PawnProps.resistances]: new Resistances([
                [DamageType.PHYSICAL, 0.25],
                [DamageType.MAGIC, 0.50],
                [DamageType.FIRE, 0.80],
            ]),
            [PawnProps.speed]: 8,
            [PawnProps.movementType]: MovementType.FLYING,
            [PawnProps.level]: 5,
            [PawnProps.race]: this.raceRegistry.get('neutral'),
            [PawnProps.leadership]: 2000,
            [PawnProps.initiative]: 7,
            [PawnProps.criticalHitChance]: 0.2,
            [PawnProps.attack]: 50,
            [PawnProps.defence]: 40,
            [PawnProps.defenceBonus]: 8,
            [PawnProps.hitback]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: 0,
        }, {
            features: [
                this.featureRegistry.get('dragon'),
            ],
            abilities: [
                new AbilityProps({
                    slot: AbilitySlot.REGULAR,
                    targetCollector: abilityScripts.defaultMelee.targetCollector,
                    apply: abilityScripts.defaultMelee.apply,
                    damageRanges: new Ranges([
                        [DamageType.FIRE, 100, 120],
                    ]),
                }),
                new AbilityProps({
                    slot: AbilitySlot.ABILITY_1,
                    charges: 1,
                    apply: abilityScripts.defaultRun.apply,
                    scriptParams: {
                        speed: 2,
                    },
                }),
                new AbilityProps({
                    slot: AbilitySlot.ABILITY_3,
                    targetCollector: abilityScripts.defaultRanged.targetCollector,
                    apply: abilityScripts.defaultRanged.apply,
                    damageRanges: new Ranges([
                        [DamageType.PHYSICAL, 6, 8],
                    ]),
                    reload: 2,
                    minDistance: 2,
                    maxDistance: 5,
                    distancePenalty: 0.5,
                    mutedIfNearEnemy: true,
                    noHitbacks: true,
                }),
            ],
        });
    }

    registerRace(name) {
        let iconImage = `raceicon_${name}.png`;
        let race = new Race(iconImage);

        this.raceRegistry.register(name, race);
    }

    registerFeature(name, props) {
        let featureProps = new FeatureProps(props);

        this.featureRegistry.register(name, featureProps);
    }

    registerEffect(name, props) {
        let effectProps = new EffectProps(props);

        this.effectRegistry.register(name, effectProps);
    }

    registerTestPawn(name, props, options) {
        let pawnProps = new PawnProps(props);
        pawnProps.initDefaultValues();

        this.pawnPropsRegistry.register(name, pawnProps);
        this.pawnOptionsRegistry.register(name, options);
    }



    getPawnProps(name) {
        return this.pawnPropsRegistry.get(name);
    }

    getPawnOptions(name) {
        return this.pawnOptionsRegistry.get(name);
    }

    getEffectProps(name) {
        return this.effectRegistry.get(name);
    }
}