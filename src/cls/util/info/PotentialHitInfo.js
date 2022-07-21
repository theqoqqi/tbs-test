export default class PotentialHitInfo {

    constructor(props) {
        this.targetName = props.targetName;
        this.minDamage = props.minDamage;
        this.maxDamage = props.maxDamage;
        this.minKills = props.minKills;
        this.maxKills = props.maxKills;
        this.willHitback = props.willHitback;
    }
}