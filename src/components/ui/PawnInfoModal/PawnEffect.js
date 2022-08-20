import styles from './styles/PawnEffect.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import EffectType from '../../../cls/enums/EffectType.js';
import Tooltip from '../../util/Tooltip';
import classNames from 'classnames';

export default class PawnEffect extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        duration: PropTypes.number,
        effectType: PropTypes.instanceOf(EffectType),
    };

    render() {
        let $tooltip = (
            <>
                <Tooltip.Title>{this.props.title}</Tooltip.Title>
                <Tooltip.Description>{this.props.description}</Tooltip.Description>
            </>
        );

        let duration = this.props.duration;
        let effectTypeName = this.props.effectType.enumKey.toLowerCase();

        return (
            <Tooltip
                classes={{ popper: styles.pawnEffectTooltip }}
                title={$tooltip}
                disableInteractive
            >
                <div
                    className={classNames(styles.pawnEffect, {
                        [styles[effectTypeName]]: true,
                    })}
                >
                    <div className={styles.pawnEffectIcon}>
                        <img src={this.props.image} alt={this.props.title} />
                    </div>
                    <span className={styles.pawnEffectTitle}>
                        {this.props.title}
                    </span>
                    {' '}
                    {duration > 0 && <>({duration})</>}
                </div>
            </Tooltip>
        );
    }
}
