import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import AbilitySlot from '../AbilitySlot';
import classNames from 'classnames';
import ActionPointsBar from '../ActionPointsBar';

export default class PawnControls extends React.Component {

    static propTypes = {
        pawnInfo: PropTypes.shape({
            currentActionPoints: PropTypes.number,
            maxActionPoints: PropTypes.number,
            abilities: PropTypes.arrayOf(PropTypes.shape(AbilitySlot.propTypes)),
            canWait: PropTypes.bool,
        }),
        onAbilityClick: PropTypes.func,
        onWaitButtonClick: PropTypes.func,
        onDefenceButtonClick: PropTypes.func,
    };

    getThreeAbilities() {
        let abilities = this.getAbilities();

        while (abilities.length < 3) {
            abilities.push(<AbilitySlot key={abilities.length} empty />);
        }

        return abilities;
    }

    getAbilities() {
        if (!this.props.pawnInfo) {
            return [];
        }

        return this.props.pawnInfo.abilities.map((ability, index) => {
            let onClick = () => {
                // noinspection JSCheckFunctionSignatures
                return this.props.onAbilityClick?.(ability.slot);
            };

            return (
                <AbilitySlot
                    key={index}
                    {...ability}
                    onClick={onClick}
                />
            );
        });
    }

    render() {
        let {
            pawnInfo,
            onWaitButtonClick,
            onDefenceButtonClick
        } = this.props;
        let $abilities = this.getThreeAbilities();

        return (
            <div className='pawn-controls'>
                <div className='abilities'>
                    {$abilities}
                </div>
                <div
                    className={classNames('move-button wait', {
                        'muted': !pawnInfo?.canWait,
                    })}
                    onClick={onWaitButtonClick}
                >
                    W
                </div>
                <div
                    className={classNames('move-button wait', {
                        'muted': !pawnInfo?.canWait,
                    })}
                    onClick={onDefenceButtonClick}
                >
                    D
                </div>
                <div className='action-points-bar-container'>
                    <ActionPointsBar
                        current={pawnInfo?.currentActionPoints}
                        max={pawnInfo?.maxActionPoints}
                        length={10}
                    />
                </div>
            </div>
        );
    }
}