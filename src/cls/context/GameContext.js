import PawnRegistry from './PawnRegistry.js';
import PawnProps from './PawnProps.js';

export default class GameContext {

    constructor() {
        let pawnRegistry = new PawnRegistry();

        this.registerTestPawn(pawnRegistry, 'qwer', {
            health: 5,
            damage: 1,
            speed: 2,
        });

        this.registerTestPawn(pawnRegistry, 'asdf', {
            health: 10,
            damage: 2,
            speed: 3,
        });

        this.registerTestPawn(pawnRegistry, 'peasant', {
            health: 6,
            damage: 1,
            speed: 2,
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