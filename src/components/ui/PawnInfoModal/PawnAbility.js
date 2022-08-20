import styles from './styles/PawnAbility.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../util/Tooltip';

export default class PawnAbility extends React.Component {

    static propTypes = {
        image: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        currentReload: PropTypes.number,
        currentCharges: PropTypes.number,
    };

    render() {
        let currentReload = this.props.currentReload;
        let currentCharges = this.props.currentCharges;

        let $tooltip = (
            <>
                <Tooltip.Title>{this.props.title}</Tooltip.Title>
                <Tooltip.Description>{this.props.description}</Tooltip.Description>
                {currentReload > 0 && <>Перезарядка: {currentReload}</>}
            </>
        );

        return (
            <Tooltip
                classes={{ popper: styles.pawnAbilityTooltip }}
                title={$tooltip}
                disableInteractive
            >
                <div className={styles.pawnAbility}>
                    <div className={styles.pawnAbilityIcon}>
                        <img src={this.props.image} alt={this.props.title} />
                    </div>
                    <span className={styles.pawnAbilityTitle}>
                        {this.props.title}
                    </span>
                    {' '}
                    {currentCharges > 0 && <>({currentCharges})</>}
                </div>
            </Tooltip>
        );
    }
}
