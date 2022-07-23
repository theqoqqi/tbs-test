export default class AbstractEffectProps {

    constructor(props) {
        this.internalName = props.internalName ?? null;
        this.scriptParams = props.scriptParams ?? {};

        this.start = props.start ?? null;
        this.incomingDamageModifier = props.incomingDamageModifier ?? null;
        this.outcomingDamageModifier = props.outcomingDamageModifier ?? null;
    }
}