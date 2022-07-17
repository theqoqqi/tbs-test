import * as targetCollectors from '../../data/scripts/targetCollectors';

export default class Resources {

    static getTargetCollector(name) {
        return targetCollectors[name];
    }
}