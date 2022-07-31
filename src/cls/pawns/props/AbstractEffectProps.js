export default class AbstractEffectProps {

    constructor(props) {
        this.internalName = props.internalName ?? null;
        this.scriptParams = props.scriptParams ?? {};

        this.hintTitle = props.hintTitle ?? props.internalName;
        this.hintDescription = props.hintDescription ?? props.internalName;

        this.getEvents = props.getEvents ?? null;
        this.propertyBonuses = props.propertyBonuses ?? null;
        this.modifyPawnProperty = props.modifyPawnProperty ?? null;
        this.modifyOtherPawnProperty = props.modifyOtherPawnProperty ?? null;
        this.incomingDamageModifier = props.incomingDamageModifier ?? null;
        this.outcomingDamageModifier = props.outcomingDamageModifier ?? null;

        this.isHidden = props.isHidden ?? false;
    }
}