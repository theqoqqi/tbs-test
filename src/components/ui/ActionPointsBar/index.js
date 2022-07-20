import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ActionPointsBar extends React.Component {

    static propTypes = {
        current: PropTypes.number,
        max: PropTypes.number,
        length: PropTypes.number,
    };
    
    constructor(props) {
        super(props);
    }

    getPoints() {
        let $points = [];

        for (let i = 0; i < this.props.length; i++) {
            let ordinal = i + 1;
            let usable = ordinal <= this.props.current;
            let used = !usable && ordinal <= this.props.max;

            let $point = (
                <div
                    className={classNames('action-point', {
                        'usable': usable,
                        'used': used,
                        'empty': !usable && !used,
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
            <div className='action-points-bar'>
                {$points}
            </div>
        );
    }
}