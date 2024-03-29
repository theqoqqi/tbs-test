import styles from './index.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ActionPointsBar extends React.Component {

    static propTypes = {
        current: PropTypes.number,
        max: PropTypes.number,
        length: PropTypes.number,
    };

    getPoints() {
        let $points = [];

        for (let i = 0; i < this.props.length; i++) {
            let ordinal = i + 1;
            let usable = ordinal <= this.props.current;
            let used = !usable && ordinal <= this.props.max;

            let $point = (
                <div
                    key={i}
                    className={classNames(styles.actionPoint, {
                        [styles.usable]: usable,
                        [styles.used]: used,
                        [styles.empty]: !usable && !used,
                    })}
                />
            );

            $points.push($point);
        }

        return $points;
    }
    
    render() {
        let $points = this.getPoints();

        return (
            <div className={styles.actionPointsBar}>
                {$points}
            </div>
        );
    }
}