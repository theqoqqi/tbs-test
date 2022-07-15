import PawnRegistry from './PawnRegistry.js';
import PawnProps from './PawnProps.js';
import MovementTypes from '../arena/MovementTypes.js';

export default class GameContext {

    constructor() {
        let pawnRegistry = new PawnRegistry();

        this.registerTestPawn(pawnRegistry, 'walker', {
            health: 5,
            minDamage: 1,
            maxDamage: 2,
            speed: 22,
            movementType: MovementTypes.WALKING,
        });

        this.registerTestPawn(pawnRegistry, 'soarer', {
            health: 10,
            minDamage: 2,
            maxDamage: 3,
            speed: 33,
            movementType: MovementTypes.SOARING,
        });

        this.registerTestPawn(pawnRegistry, 'peasant', {
            health: 6,
            minDamage: 1,
            maxDamage: 2,
            speed: 2,
            movementType: MovementTypes.WALKING,
        });

        this.registerTestPawn(pawnRegistry, 'dragon', {
            health: 800,
            minDamage: 100,
            maxDamage: 120,
            speed: 100,
            movementType: MovementTypes.FLYING,
        });

        this.pawnRegistry = pawnRegistry;
    }

    registerTestPawn(pawnRegistry, name, props) {
        let pawnProps = new PawnProps();

        for (const [propName, prop] of Object.entries(props)) {
            pawnProps[propName] = prop;
        }

        pawnRegistry.register(name, pawnProps);
    }
}