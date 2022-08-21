import styles from './index.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {default as AbilitySlotEnum} from '../../../cls/enums/AbilitySlot.js';
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
            canDefence: PropTypes.bool,
        }),
        onAbilityClick: PropTypes.func,
        onWaitButtonClick: PropTypes.func,
        onDefenceButtonClick: PropTypes.func,
    };

    getAbilities() {
        if (!this.props.pawnInfo) {
            return [];
        }

        let slots = [AbilitySlotEnum.ABILITY_1, AbilitySlotEnum.ABILITY_2, AbilitySlotEnum.ABILITY_3];

        return slots.map((slot, index) => {
            let ability = this.props.pawnInfo.abilities.find(ability => ability.slot === slot);

            if (!ability) {
                return <AbilitySlot key={index} empty />;
            }

            let onClick = () => {
                return this.props.onAbilityClick?.(slot);
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

        let $abilities = this.getAbilities();

        return (
            <div className={styles.pawnControls}>
                <div className={styles.abilities}>
                    {$abilities}
                </div>
                <div
                    className={classNames(styles.moveButton, styles.wait, {
                        [styles.muted]: !pawnInfo?.canWait,
                    })}
                    onClick={onWaitButtonClick}
                >
                    W
                </div>
                <div
                    className={classNames(styles.moveButton, styles.defence, {
                        [styles.muted]: !pawnInfo?.canDefence,
                    })}
                    onClick={onDefenceButtonClick}
                >
                    D
                </div>
                <div className={styles.actionPointsBarContainer}>
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