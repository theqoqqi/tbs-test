import styles from './styles/PawnFeature.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../util/Tooltip';

export default class PawnFeature extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
    };

    render() {
        let $tooltip = (
            <>
                <Tooltip.Title>{this.props.title}</Tooltip.Title>
                <Tooltip.Description>{this.props.description}</Tooltip.Description>
            </>
        );

        return (
            <Tooltip
                classes={{ popper: styles.pawnFeatureTooltip }}
                title={$tooltip}
                disableInteractive>
                <div className={styles.pawnFeature}>
                    <span className={styles.pawnFeatureTitle}>
                        {this.props.title}
                    </span>
                </div>
            </Tooltip>
        );
    }
}
