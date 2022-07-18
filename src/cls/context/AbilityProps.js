
export default class AbilityProps {

    constructor(props) {
        this.slot = props.slot;
        this.targetCollector = props.targetCollector ?? (() => []);
        this.damageRanges = props.damageRanges;
        this.minDistance = props.minDistance ?? null;
        this.maxDistance = props.maxDistance ?? null;
        this.distancePenalty = props.distancePenalty ?? 1;
        this.disabledIfNearEnemy = props.disabledIfNearEnemy ?? false;
        this.noHitbacks = props.noHitbacks ?? false;
    }
}