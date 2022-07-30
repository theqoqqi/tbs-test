
let parseBoolean = value => {
    if (value === undefined) {
        return undefined;
    }

    return !!parseInt(value);
};

let getRegexMatch = (value, regex, matchIndex = 1) => {
    let match = regex.exec(value);

    return match?.[matchIndex] ?? null;
};

module.exports = class AtomConverter {

    movementTypes = new Map([
        [-2, 'immobile'],
        [0, 'walking'],
        [1, 'soaring'],
        [2, 'flying'],
    ]);

    hitbackTypes = new Map([
        [0, 'never'],
        [1, 'once_per_round'],
        [2, 'always'],
    ]);

    paramReaders = {
        pawnType: () => 'squad',
        race: params => params.race,
        level: params => parseInt(params.level),
        leadership: params => parseInt(params.leadership),
        morale: params => params.features_label === 'cpi_knight_feat_new' ? 1 : 0, // Для рыцаря 1, у остальных 0
        attack: params => parseInt(params.attack),
        defence: params => parseInt(params.defense),
        defenceBonus: params => parseInt(params.defenseup),
        actionPoints: params => parseInt(params.speed),
        initiative: params => parseInt(params.initiative),
        criticalHitChance: params => AtomConverter.parsePercents(params.krit),
        health: params => parseInt(params.hitpoint),
        movementType: params => this.movementTypes.get(parseInt(params.movetype)),
        hitbackFrequency: params => this.hitbackTypes.get(parseInt(params.hitback)),
        hitbackProtection: params => !!parseInt(params.hitbackprotect),
        resistances: params => {
            return Object.entries(params.resistances)
                .map(([type, resistance]) => {
                    return [type, AtomConverter.parsePercents(resistance)];
                })
                .filter(([type, resistance]) => resistance > 0);
        },
    };

    abilityReaders = {
        slot: (ability, name, slot) => slot === null ? 'regular' : `ability_${slot}`,
        base: ability => ability.class === 'throw' ? 'defaultRanged' : 'defaultMelee',
        internalName: (ability, name, slot) => slot ? name : undefined,
        imageName: ability => getRegexMatch(ability.picture, /[Bb][Aa]1_(\w+)_/) ?? undefined,
        hintTitle: ability => ability.hinthead,
        hintDescription: ability => ability.hint,
        reload: ability => parseInt(ability.reload) || undefined,
        charges: ability => parseInt(ability.moves) || undefined,
        scriptParams: ability => ability.custom_params,
        getEvents: ability => undefined,
        getMoveInfo: ability => undefined,
        targetCollector: ability => undefined,
        apply: ability => undefined,
        damageRanges: ability => {
            if (!ability.damage) {
                return undefined;
            }
            return Object.entries(ability.damage)
                .map(([type, damages]) => {
                    damages = damages.split(',').map(n => parseInt(n));
                    if (damages.length === 1) {
                        damages.push(damages[0]);
                    }
                    return [type, ...damages];
                });
        },
        minDistance: ability => parseInt(ability.mindist) || undefined,
        maxDistance: ability => parseInt(ability.distance) || undefined,
        distancePenalty: ability => parseFloat(ability.penalty) || undefined,
        disabledIfNearEnemy: ability => parseBoolean(ability.dontusenearenemy)
            ?? (ability.class === 'throw' || undefined),
        mutedIfNearEnemy: ability => undefined,
        endsTurn: ability => parseBoolean(ability.endmove),
        noHitbacks: ability => undefined,
    };

    json;

    convertAtomToJson(atom) {
        this.atom = atom;
        this.json = {
            props: {},
            options: {
                features: [],
                __featuresFromHints: [],
                abilities: [],
                __nonRegularAbilities: [],
                __rawAtomAbilities: [],
            }
        };

        this.convertParams();
        this.convertFeatures();
        this.convertFeaturesFromHints();
        this.convertAbilities();

        return this.json;
    }

    convertParams() {
        let atomParams = this.atom.arena_params;
        let jsonParams = this.json.props;

        for (let [key, reader] of Object.entries(this.paramReaders)) {
            jsonParams[key] = reader(atomParams);
        }
    }

    convertFeatures() {
        let atomFeatures = this.atom.arena_params.features ?? '';

        if (atomFeatures) {
            this.json.options.features = atomFeatures.split(',').map(s => s.trim());
        }
    }

    convertFeaturesFromHints() {
        let atomFeatures = this.atom.arena_params.features_hints ?? '';

        if (atomFeatures) {
            this.json.options.__featuresFromHints = atomFeatures.split(',')
                .map(s => {
                    let start = s.indexOf('/') + 1;
                    let end = s.lastIndexOf('_');

                    return s.substring(start, end);
                });
        }
    }

    convertAbilities() {
        let atomParams = this.atom.arena_params;
        let atomAbilityNames = atomParams.attacks ? atomParams.attacks.split(',') : [];
        let nonRegularAbilities = atomAbilityNames
            .filter(name => !atomParams[name].group && name !== 'moveattack')
            .map(name => atomParams[name]);

        for (const abilityName of atomAbilityNames) {
            let atomAbility = atomParams[abilityName];
            let slot = atomAbility.group || abilityName === 'moveattack'
                ? null : nonRegularAbilities.indexOf(atomAbility) + 1;
            let jsonAbility = this.convertAbility(atomAbility, abilityName, slot);

            if (slot === null) {
                this.json.options.abilities.unshift(jsonAbility);
            } else {
                this.json.options.__nonRegularAbilities.push(jsonAbility);
            }
            this.json.options.__rawAtomAbilities.push(atomAbility);
        }
    }

    convertAbility(atomAbility, abilityName, slot) {
        let jsonAbility = {};

        for (let [key, reader] of Object.entries(this.abilityReaders)) {
            jsonAbility[key] = reader(atomAbility, abilityName, slot);
        }

        return jsonAbility;
    }

    static parsePercents(value) {
        return parseFloat((parseInt(value) / 100).toFixed(2))
    }
}