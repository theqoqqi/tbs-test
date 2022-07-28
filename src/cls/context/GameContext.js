import FeatureProps from '../pawns/props/FeatureProps.js';
import PawnProps from '../pawns/props/PawnProps.js';
import Registry from './Registry.js';
import EffectProps from '../pawns/props/EffectProps.js';
import Race from '../pawns/Race.js';
import * as races from '../../data/json/races';
import * as featureJsons from '../../data/json/features';
import * as effectJsons from '../../data/json/effects';
import * as pawnJsons from '../../data/json/pawns';
import Deserializer from './Deserializer.js';
import lodash from 'lodash';

export default class GameContext {

    constructor() {
        this.deserializer = new Deserializer(this);
        this.raceRegistry = new Registry();
        this.featureRegistry = new Registry();
        this.effectRegistry = new Registry();
        this.pawnPropsRegistry = new Registry();
        this.pawnOptionsRegistry = new Registry();

        this.#registerRaces();
        this.#registerFeatures();
        this.#registerEffects();
        this.#registerPawns();
    }

    #registerRaces() {
        for (const [raceName, race] of Object.entries(races)) {
            this.registerRace(raceName, race);
        }
    }

    #registerFeatures() {
        for (const [featureName, featureJson] of Object.entries(featureJsons)) {
            this.registerFeatureFromJson(featureName, featureJson);
        }
    }

    #registerEffects() {
        for (const [effectName, effectJson] of Object.entries(effectJsons)) {
            this.registerEffectFromJson(effectName, effectJson);
        }
    }

    #registerPawns() {
        for (const [unitName, pawnJson] of Object.entries(pawnJsons)) {
            this.registerPawnFromJson(unitName, pawnJson);
        }
    }



    registerFeatureFromJson(internalName, featureJson) {
        lodash.set(featureJson, 'props.base', internalName);

        let deserializedFeature = this.deserializer.deserializeFeature(featureJson);
        let props = deserializedFeature.props ?? {};

        this.registerFeature(internalName, props);
    }

    registerEffectFromJson(internalName, effectJson) {
        lodash.set(effectJson, 'props.base', internalName);

        let deserializedEffect = this.deserializer.deserializeEffect(effectJson);
        let props = deserializedEffect.props ?? {};

        this.registerEffect(internalName, props);
    }

    registerPawnFromJson(unitName, pawnJson) {
        lodash.set(pawnJson, 'props.base', unitName);

        let deserializedPawn = this.deserializer.deserializePawn(pawnJson);
        let props = deserializedPawn.props ?? {};
        let options = deserializedPawn.options ?? {};

        this.registerPawn(unitName, props, options);
    }



    registerRace(name) {
        let iconImage = `raceicon_${name}.png`;
        let race = new Race(iconImage);

        this.raceRegistry.register(name, race);
    }

    registerFeature(name, props) {
        let featureProps = new FeatureProps(props);
        featureProps.internalName = name;

        this.featureRegistry.register(name, featureProps);
    }

    registerEffect(name, props) {
        let effectProps = new EffectProps(props);
        effectProps.internalName = name;

        this.effectRegistry.register(name, effectProps);
    }

    registerPawn(name, props, options = {}) {
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