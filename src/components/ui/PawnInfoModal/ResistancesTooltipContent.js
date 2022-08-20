import React from 'react';
import DamageType from '../../../cls/enums/DamageType.js';
import PawnParameter from './PawnParameter.js';

export default class ResistancesTooltipContent extends React.Component {

    render() {
        let $parameters = DamageType.enumValues.map((damageType, index) => {
            let resistance = this.props.resistances.get(damageType);

            return (
                <PawnParameter
                    key={index}
                    title={damageType.enumKey}
                    value={resistance * 100 + ' %'}
                    noAside
                    containerProps={{
                        style: {fontSize: '11px'},
                    }}
                />
            );
        });

        return <>{$parameters}</>;
    }
}