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
import AbilityProps from '../pawns/props/AbilityProps.js';
import DamageType from '../enums/DamageType.js';

let enumMapper = enumType => {
    return value => {
        return enumType.enumValueOf(value.toUpperCase());
    };
};

let constructorMapper = (constructor, deserializer) => {
    return value => {
        if (deserializer) {
            value = deserializer(value);
        }

        return new constructor(value);
    };
};

let registryMapper = registrySupplier => {
    return value => {
        let registry = registrySupplier();

        return registry.get(value);
    };
};

let arrayMapper = (ofMapper, filter) => {
    filter ??= () => true;
    return value => {
        return value.map(ofMapper).filter(filter);
    };
};

let scriptMapper = root => {
    let mapper = value => {
        return lodash.get(root, value);
    };

    mapper.mapperType = 'scriptMapper';

    return mapper;
};

let firstItemMapper = ofMapper => {
    return value => {
        return value.map(item => {
            item[0] = ofMapper(item[0]);
            return item;
        });
    };
};

export default class Deserializer {

    #featureMappings = {
        props: {
            getEvents: scriptMapper(featureScripts),
            modifyPawnProperty: scriptMapper(featureScripts),
            modifyOtherPawnProperty: scriptMapper(featureScripts),
            outcomingDamageModifier: scriptMapper(featureScripts),
            incomingDamageModifier: scriptMapper(featureScripts),
        },
    };

    #effectMappings = {
        props: {
            effectType: enumMapper(EffectType),
            getEvents: scriptMapper(effectScripts),
            modifyPawnProperty: scriptMapper(effectScripts),
            modifyOtherPawnProperty: scriptMapper(effectScripts),
        },
    };

    #pawnMappings = {
        props: {
            [PawnProps.pawnType]: enumMapper(PawnType),
            [PawnProps.race]: registryMapper(() => this.#context.raceRegistry),
            [PawnProps.resistances]: constructorMapper(Resistances, firstItemMapper(enumMapper(DamageType))),
            [PawnProps.movementType]: enumMapper(MovementType),
            [PawnProps.hitbackFrequency]: enumMapper(HitbackFrequency),
        },
        options: {
            features: arrayMapper(
                registryMapper(() => this.#context.featureRegistry),
                feature => !!feature,
            ),
            abilities: arrayMapper(constructorMapper(AbilityProps, value => this.deserialize(value, {
                slot: enumMapper(AbilitySlot),
                damageRanges: constructorMapper(Ranges, firstItemMapper(enumMapper(DamageType))),
                getEvents: scriptMapper(abilityScripts),
                targetCollector: scriptMapper(abilityScripts),
                apply: scriptMapper(abilityScripts),
            }))),
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

    deserialize(json, mappings, pa) {
        // Необходимо создавать копию, чтобы не вносить изменения в импортированный json.
        // Это необходимо только в режиме разработчика, т.к. реакт обновляет приложение
        // без перезагрузки страницы, а данные уже оказываются изменены.
        json = lodash.cloneDeep(json);

        if (json.base) {
            for (const [key, mapping] of Object.entries(mappings)) {
                if (mapping.mapperType === 'scriptMapper') {
                    json[key] ??= `${json.base}.${key}`;
                }
            }
        }

        let data = {};

        for (const [key, value] of Object.entries(json)) {
            try {
                let parsedValue = this.parseValue(mappings, key, value);

                if (parsedValue !== undefined) {
                    data[key] = parsedValue;
                }
            } catch (e) {
                console.error('Failed to deserialize:', key, value, e);
            }
        }

        return data;
    }

    parseValue(mappings, key, value) {
        let mapping = mappings[key];

        if (typeof mapping === 'function') {
            return mapping(value);

        } else if (typeof mapping === 'object') {
            return this.deserialize(value, mapping);

        } else {
            return value;
        }
    }
}