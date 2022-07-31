import AbstractEffectProps from './AbstractEffectProps.js';
import EffectType from '../../enums/EffectType.js';

export default class EffectProps extends AbstractEffectProps {

    constructor(props) {
        super(props);

        this.effectType = props.effectType ?? EffectType.NEUTRAL;

        this.imageName = props.imageName ?? props.internalName;
    }
}