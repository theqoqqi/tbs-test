const PassabilityTypes = Object.freeze({
    WALKING_PASSABLE: Symbol('PassabilityTypes.WALKING_PASSABLE'),
    SOARING_PASSABLE: Symbol('PassabilityTypes.SOARING_PASSABLE'),
    FLYING_PASSABLE: Symbol('PassabilityTypes.FLYING_PASSABLE'),
    IMPASSABLE: Symbol('PassabilityTypes.IMPASSABLE'),
    keyOf(type) {
        if (typeof type !== 'symbol') {
            return null;
        }

        return Object.keys(this).find(key => this[key] === type);
    }
});

export default PassabilityTypes;