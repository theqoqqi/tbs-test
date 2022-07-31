export default class AbilityProps {

    constructor(props) {
        this.internalName = props.internalName;
        this.slot = props.slot;
        this.reload = props.reload ?? 0;
        this.charges = props.charges ?? null;
        this.scriptParams = props.scriptParams ?? {};

        this.imageName = props.imageName ?? props.internalName;
        this.hintTitle = props.hintTitle ?? props.internalName;
        this.hintDescription = props.hintDescription ?? props.internalName;

        this.getEvents = props.getEvents ?? null;
        this.getMoveInfo = props.getMoveInfo ?? null;
        this.targetCollector = props.targetCollector ?? null;
        this.apply = props.apply ?? null;

        this.damageRanges = props.damageRanges;
        this.minDistance = props.minDistance ?? null;
        this.maxDistance = props.maxDistance ?? null;
        this.distancePenalty = props.distancePenalty ?? 1;

        this.disabledIfNearEnemy = props.disabledIfNearEnemy ?? false;
        this.mutedIfNearEnemy = props.mutedIfNearEnemy ?? false;
        this.usesMovement = props.usesMovement ?? false;
        this.endsTurn = props.endsTurn ?? true;
        this.noHitbacks = props.noHitbacks ?? false;
    }
}