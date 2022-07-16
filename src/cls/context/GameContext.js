import PawnRegistry from './PawnRegistry.js';
import PawnProps from './PawnProps.js';
import MovementType from '../enums/MovementType.js';
import Race from '../types/Race.js';
import Ranges from '../util/Ranges.js';
import DamageType from '../enums/DamageType.js';
import Resistances from '../util/Resistances.js';

export default class GameContext {

    constructor() {
        this.pawnRegistry = new PawnRegistry();
        this.races = new Map();

        this.registerRace('demon');
        this.registerRace('dwarf');
        this.registerRace('orc');
        this.registerRace('neutral');
        this.registerRace('elf');
        this.registerRace('human');
        this.registerRace('spirit');
        this.registerRace('lizard');
        this.registerRace('undead');

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
            [PawnProps.race]: this.races.get('neutral'),
            [PawnProps.leadership]: 8,
            [PawnProps.initiative]: 3,
            [PawnProps.criticalHitChance]: 0.15,
            [PawnProps.attack]: 3,
            [PawnProps.defence]: 1,
            [PawnProps.defenceBonus]: 1,
            [PawnProps.hitback]: 1,
            [PawnProps.hitbackProtection]: 0,
        });

        this.registerTestPawn('soarer', {
            [PawnProps.health]: 10,
            [PawnProps.damageRanges]: new Ranges([
                [DamageType.PHYSICAL, 1, 2],
                [DamageType.MAGIC, 1, 1],
            ]),
            [PawnProps.resistances]: new Resistances([
                [DamageType.PHYSICAL, 0.5],
            ]),
            [PawnProps.speed]: 3,
            [PawnProps.movementType]: MovementType.SOARING,
            [PawnProps.level]: 1,
            [PawnProps.race]: this.races.get('undead'),
            [PawnProps.leadership]: 12,
            [PawnProps.initiative]: 2,
            [PawnProps.criticalHitChance]: 0.08,
            [PawnProps.attack]: 3,
            [PawnProps.defence]: 5,
            [PawnProps.defenceBonus]: 2,
            [PawnProps.hitback]: 1,
            [PawnProps.hitbackProtection]: 0,
        });

        this.registerTestPawn('peasant', {
            [PawnProps.health]: 6,
            [PawnProps.damageRanges]: new Ranges([
                [DamageType.PHYSICAL, 1, 2],
            ]),
            [PawnProps.resistances]: new Resistances(),
            [PawnProps.speed]: 2,
            [PawnProps.movementType]: MovementType.WALKING,
            [PawnProps.level]: 1,
            [PawnProps.race]: this.races.get('human'),
            [PawnProps.leadership]: 5,
            [PawnProps.initiative]: 3,
            [PawnProps.criticalHitChance]: 0.1,
            [PawnProps.attack]: 1,
            [PawnProps.defence]: 1,
            [PawnProps.defenceBonus]: 1,
            [PawnProps.hitback]: 1,
            [PawnProps.hitbackProtection]: 0,
        });

        this.registerTestPawn('dragon', {
            [PawnProps.health]: 800,
            [PawnProps.damageRanges]: new Ranges([
                [DamageType.FIRE, 100, 120],
            ]),
            [PawnProps.resistances]: new Resistances([
                [DamageType.PHYSICAL, 0.25],
                [DamageType.MAGIC, 0.25],
                [DamageType.FIRE, 0.80],
            ]),
            [PawnProps.speed]: 8,
            [PawnProps.movementType]: MovementType.FLYING,
            [PawnProps.level]: 5,
            [PawnProps.race]: this.races.get('neutral'),
            [PawnProps.leadership]: 2000,
            [PawnProps.initiative]: 7,
            [PawnProps.criticalHitChance]: 0.2,
            [PawnProps.attack]: 50,
            [PawnProps.defence]: 40,
            [PawnProps.defenceBonus]: 8,
            [PawnProps.hitback]: 1,
            [PawnProps.hitbackProtection]: 0,
        });
    }

    registerRace(name) {
        let iconImage = `raceicon_${name}.png`;
        let race = new Race(iconImage);

        this.races.set(name, race);
    }

    registerTestPawn(name, props) {
        let pawnProps = new PawnProps(props);

        this.pawnRegistry.register(name, pawnProps);
    }
}