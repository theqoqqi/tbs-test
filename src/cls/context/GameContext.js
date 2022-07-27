import MovementType from '../enums/MovementType.js';
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
import EffectType from '../enums/EffectType.js';
import Race from '../pawns/Race.js';
import PawnType from '../enums/PawnType.js';

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



        this.registerFeature('morale', {
            internalName: 'morale',
            isHidden: true,
            modifyPawnProperty: featureScripts.morale.modifyPawnProperty,
        });
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
            effectType: EffectType.DEBUFF,
            getEvents: effectScripts.burn.getEvents,
        });
        this.registerEffect('blockBonus', {
            internalName: 'blockBonus',
            effectType: EffectType.BUFF,
            modifyPawnProperty: effectScripts.blockBonus.modifyPawnProperty,
        });



        this.registerTestPawn('ice_shard', {
            [PawnProps.pawnType]: PawnType.STRUCTURE,
            [PawnProps.health]: 1000,
            [PawnProps.actionPoints]: 0,
            [PawnProps.initiative]: 0,
            [PawnProps.movementType]: MovementType.IMMOBILE,
            [PawnProps.level]: 1,
            [PawnProps.race]: this.raceRegistry.get('neutral'),
            [PawnProps.attack]: 1,
            [PawnProps.defence]: 10,
            [PawnProps.defenceBonus]: 1,
            [PawnProps.hitbackFrequency]: HitbackFrequency.NEVER,
        });



        this.registerTestPawn('ap_shard', {
            [PawnProps.pawnType]: PawnType.ITEM,
            [PawnProps.movementType]: MovementType.IMMOBILE,
            [PawnProps.invulnerable]: true,
        });



        this.registerTestPawn('walker', {
            [PawnProps.pawnType]: PawnType.SQUAD,
            [PawnProps.health]: 5,
            [PawnProps.damageRanges]: new Ranges([
                [DamageType.PHYSICAL, 1, 2],
            ]),
            [PawnProps.resistances]: new Resistances([
                [DamageType.MAGIC, 0.25],
            ]),
            [PawnProps.actionPoints]: 2,
            [PawnProps.movementType]: MovementType.WALKING,
            [PawnProps.level]: 1,
            [PawnProps.race]: this.raceRegistry.get('neutral'),
            [PawnProps.leadership]: 8,
            [PawnProps.initiative]: 3,
            [PawnProps.criticalHitChance]: 0.15,
            [PawnProps.attack]: 3,
            [PawnProps.defence]: 1,
            [PawnProps.defenceBonus]: 1,
            [PawnProps.hitbackFrequency]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: false,
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
                    internalName: 'run',
                    slot: AbilitySlot.ABILITY_1,
                    charges: 1,
                    apply: abilityScripts.defaultRun.apply,
                    scriptParams: {
                        actionPoints: 2,
                    },
                }),
            ],
        });

        this.registerTestPawn('soarer', {
            [PawnProps.pawnType]: PawnType.SQUAD,
            [PawnProps.health]: 10,
            [PawnProps.resistances]: new Resistances([
                [DamageType.PHYSICAL, 0.5],
            ]),
            [PawnProps.actionPoints]: 3,
            [PawnProps.movementType]: MovementType.SOARING,
            [PawnProps.level]: 1,
            [PawnProps.race]: this.raceRegistry.get('undead'),
            [PawnProps.leadership]: 12,
            [PawnProps.initiative]: 2,
            [PawnProps.criticalHitChance]: 0.08,
            [PawnProps.attack]: 3,
            [PawnProps.defence]: 5,
            [PawnProps.defenceBonus]: 2,
            [PawnProps.hitbackFrequency]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: false,
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
                    internalName: 'magicAttack',
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
            [PawnProps.pawnType]: PawnType.SQUAD,
            [PawnProps.health]: 30,
            [PawnProps.resistances]: new Resistances(),
            [PawnProps.actionPoints]: 2,
            [PawnProps.movementType]: MovementType.WALKING,
            [PawnProps.level]: 2,
            [PawnProps.race]: this.raceRegistry.get('human'),
            [PawnProps.leadership]: 50,
            [PawnProps.initiative]: 5,
            [PawnProps.criticalHitChance]: 0.12,
            [PawnProps.attack]: 15,
            [PawnProps.defence]: 8,
            [PawnProps.defenceBonus]: 2,
            [PawnProps.hitbackFrequency]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: false,
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
                    internalName: 'powerShot',
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
            [PawnProps.pawnType]: PawnType.SQUAD,
            [PawnProps.health]: 6,
            [PawnProps.resistances]: new Resistances(),
            [PawnProps.actionPoints]: 2,
            [PawnProps.movementType]: MovementType.WALKING,
            [PawnProps.level]: 1,
            [PawnProps.race]: this.raceRegistry.get('human'),
            [PawnProps.leadership]: 5,
            [PawnProps.initiative]: 3,
            [PawnProps.criticalHitChance]: 0.1,
            [PawnProps.attack]: 1,
            [PawnProps.defence]: 1,
            [PawnProps.defenceBonus]: 1,
            [PawnProps.hitbackFrequency]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: false,
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
            [PawnProps.pawnType]: PawnType.SQUAD,
            [PawnProps.health]: 800,
            [PawnProps.resistances]: new Resistances([
                [DamageType.PHYSICAL, 0.25],
                [DamageType.MAGIC, 0.50],
                [DamageType.FIRE, 0.80],
            ]),
            [PawnProps.actionPoints]: 8,
            [PawnProps.movementType]: MovementType.FLYING,
            [PawnProps.level]: 5,
            [PawnProps.race]: this.raceRegistry.get('neutral'),
            [PawnProps.leadership]: 2000,
            [PawnProps.initiative]: 7,
            [PawnProps.criticalHitChance]: 0.2,
            [PawnProps.attack]: 50,
            [PawnProps.defence]: 40,
            [PawnProps.defenceBonus]: 8,
            [PawnProps.hitbackFrequency]: HitbackFrequency.ONCE_PER_ROUND,
            [PawnProps.hitbackProtection]: false,
        }, {
            features: [
                this.featureRegistry.get('dragon'),
            ],
            abilities: [
                new AbilityProps({
                    slot: AbilitySlot.REGULAR,
                    targetCollector: abilityScripts.defaultMelee.targetCollector,
                    apply: abilityScripts.defaultMelee.apply,
                    getEvents: abilityScripts.burningAttack.getEvents,
                    damageRanges: new Ranges([
                        [DamageType.FIRE, 100, 120],
                    ]),
                    scriptParams: {
                        burnDuration: 2,
                    },
                }),
                new AbilityProps({
                    internalName: 'run',
                    slot: AbilitySlot.ABILITY_1,
                    charges: 1,
                    apply: abilityScripts.defaultRun.apply,
                    scriptParams: {
                        actionPoints: 2,
                    },
                }),
                new AbilityProps({
                    internalName: 'powerShot',
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

    registerTestPawn(name, props, options = {}) {
        let pawnProps = new PawnProps(props);
        pawnProps.initDefaultValues();

        options = this.#addDefaultFeatures(options);

        this.pawnPropsRegistry.register(name, pawnProps);
        this.pawnOptionsRegistry.register(name, options);
    }

    #addDefaultFeatures(options) {
        if (!options.features) {
            options.features = [];
        }

        options.features.unshift(this.featureRegistry.get('morale'));

        return options;
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