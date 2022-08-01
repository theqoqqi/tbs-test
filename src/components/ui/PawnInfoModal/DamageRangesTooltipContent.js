import React from 'react';
import PawnParameter from './PawnParameter.js';

export default class DamageRangesTooltipContent extends React.Component {

    render() {
        let $parameters = this.props.damageRanges.keys().map((damageType, index) => {
            let min = this.props.damageRanges.getMin(damageType);
            let max = this.props.damageRanges.getMax(damageType);

            return (
                <PawnParameter
                    key={index}
                    title={damageType.enumKey}
                    value={`${min} - ${max}`}
                    noAside
                />
            );
        });

        return <>{$parameters}</>;
    }
}