import styles from './index.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../util/Tooltip';
import {buildStyles, CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import classNames from 'classnames';

export default class AbilitySlot extends React.Component {

    static propTypes = {
        muted: PropTypes.bool,
        ready: PropTypes.bool,
        selected: PropTypes.bool,
        title: PropTypes.string,
        description: PropTypes.string,
        currentReload: PropTypes.number,
        maxReload: PropTypes.number,
        usesCharges: PropTypes.bool,
        charges: PropTypes.number,

        empty: PropTypes.bool,

        onClick: PropTypes.func,
    };

    render() {
        if (this.props.empty) {
            return (
                <div className={classNames(styles.abilitySlot, styles.empty)} />
            );
        }

        let {
            image,
            title,
            description,
            currentReload,
            maxReload,
            usesCharges,
            charges,
            muted,
            ready,
            selected,
            onClick,
        } = this.props;

        return (
            <Tooltip
                classes={{ popper: styles.abilityTooltip }}
                title={(
                    <>
                        <div>
                            {title ?? '[title]'}
                        </div>
                        <div>
                            {description ?? '[description]'}
                        </div>
                    </>
                )}
                disableInteractive>
                <div
                    className={{
                        [styles.abilitySlot]: true,
                        [styles.reloading]: currentReload > 0,
                        [styles.muted]: muted,
                        [styles.ready]: ready,
                        [styles.selected]: selected,
                    }}
                    style={{
                        backgroundImage: `url('${image}')`,
                    }}
                    onClick={onClick}
                >
                    {usesCharges && (
                        <span className={styles.abilityCharges}>
                            {charges}
                        </span>
                    )}
                    {currentReload > 0 && (
                        <div className={styles.abilityReloadContainer}>
                            <CircularProgressbar
                                className={styles.abilityReload}
                                value={currentReload}
                                maxValue={maxReload}
                                strokeWidth={50}
                                background={true}
                                styles={buildStyles({
                                    strokeLinecap: 'butt',
                                    pathColor: 'rgba(255, 0, 0, 0.5)',
                                    trailColor: 'transparent',
                                    backgroundColor: 'transparent',
                                })}
                            />
                        </div>
                    )}
                </div>
            </Tooltip>
        );
    }
}