export default class ExactHitInfo {

    constructor(props) {
        this.kills = props.kills;
        this.damage = props.damage;
        this.isCriticalHit = props.isCriticalHit;
        this.indexInHitChain = props.indexInHitChain;
    }
}