
export default class AbilityProps {

    constructor(props) {
        this.slot = props.slot;
        this.damageRanges = props.damageRanges;
        this.reload = props.reload ?? 0;
        this.charges = props.charges ?? 0;

        this.targetCollector = props.targetCollector ?? null;
        this.apply = props.apply ?? null;

        this.minDistance = props.minDistance ?? null;
        this.maxDistance = props.maxDistance ?? null;
        this.distancePenalty = props.distancePenalty ?? 1;

        this.disabledIfNearEnemy = props.disabledIfNearEnemy ?? false;
        this.mutedIfNearEnemy = props.mutedIfNearEnemy ?? false;
        this.endsTurn = props.endsTurn ?? true;
        this.noHitbacks = props.noHitbacks ?? false;
    }
}