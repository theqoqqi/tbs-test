import PawnProps from '../pawns/props/PawnProps.js';
import PawnType from '../enums/PawnType.js';
import Resistances from '../util/Resistances.js';
import MovementType from '../enums/MovementType.js';
import HitbackFrequency from '../enums/HitbackFrequency.js';
import Ranges from '../util/Ranges.js';
import * as featureScripts from '../../data/scripts/features';
import * as effectScripts from '../../data/scripts/effects';
import * as abilityScripts from '../../data/scripts/abilities';
import lodash from 'lodash';
import AbilitySlot from '../enums/AbilitySlot.js';
import EffectType from '../enums/EffectType.js';

let enumMapper = enumType => {
    return value => {
        return enumType.enumValueOf(value.toUpperCase());
    };
};

let constructorMapper = constructor => {
    return value => {
        return new constructor(value);
    };
};

let registryMapper = registrySupplier => {
    return value => {
        let registry = registrySupplier();

        return registry.get(value);
    };
};

let arrayMapper = ofMapper => {
    return value => {
        return value.map(ofMapper);
    };
};

let scriptMapper = root => {
    return value => {
        return lodash.get(root, value);
    };
};

export default class Deserializer {

    #featureMappings = {
        props: {
            modifyPawnProperty: scriptMapper(featureScripts),
            outcomingDamageModifier: scriptMapper(featureScripts),
            incomingDamageModifier: scriptMapper(featureScripts),
        },
    };

    #effectMappings = {
        props: {
            effectType: enumMapper(EffectType),
            getEvents: scriptMapper(effectScripts),
            modifyPawnProperty: scriptMapper(effectScripts),
        },
    };

    #pawnMappings = {
        props: {
            [PawnProps.pawnType]: enumMapper(PawnType),
            [PawnProps.race]: registryMapper(() => this.#context.raceRegistry),
            [PawnProps.resistances]: constructorMapper(Resistances),
            [PawnProps.movementType]: enumMapper(MovementType),
            [PawnProps.hitbackFrequency]: enumMapper(HitbackFrequency),
        },
        options: {
            features: arrayMapper(registryMapper(() => this.#context.featureRegistry)),
            abilities: arrayMapper(value => this.deserialize(value, {
                slot: enumMapper(AbilitySlot),
                damageRanges: constructorMapper(Ranges),
                getEvents: scriptMapper(abilityScripts),
                targetCollector: scriptMapper(abilityScripts),
                apply: scriptMapper(abilityScripts),
            })),
        }
    };

    #context;

    constructor(context) {
        this.#context = context;
    }

    deserializeFeature(featureJson) {
        return this.deserialize(featureJson, this.#featureMappings);
    }

    deserializeEffect(effectJson) {
        return this.deserialize(effectJson, this.#effectMappings);
    }

    deserializePawn(pawnJson) {
        return this.deserialize(pawnJson, this.#pawnMappings);
    }

    deserialize(pawnJson, mappings) {
        let data = {};

        for (const [key, value] of Object.entries(pawnJson)) {
            let mapping = mappings[key];

            if (typeof mapping === 'function') {
                data[key] = mapping(value);

            } else if (typeof mapping === 'object') {
                data[key] = this.deserialize(value, mapping);

            } else {
                data[key] = value;
            }
        }

        return data;
    }
}