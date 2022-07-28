import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Vector from '../../../cls/util/Vector.js';
import ArenaContext from '../../arena/Arena/ArenaContext.js';
import {paramCase} from 'change-case';
import PassabilityType from '../../../cls/enums/PassabilityType.js';

export default class ArenaCell extends React.Component {

    static contextType = ArenaContext;

    static propTypes = {
        id: PropTypes.number.isRequired,
        axialPosition: PropTypes.instanceOf(Vector),
        position: PropTypes.instanceOf(Vector),
        selectable: PropTypes.bool,
        selected: PropTypes.bool,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        passability: PropTypes.oneOf(Object.values(PassabilityType)),
        distance: PropTypes.number,
        onClick: PropTypes.func,
        onMouseMove: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    static defaultProps = {
        content: '',
        distance: 0,
    };

    render() {
        // Генератор хексов
        // https://weareoutman.github.io/rounded-polygon/

        let distanceSpan = distance > 0 && (
            <span
                className='distance'
                style={{
                    color: this.props.distance === -1 ? 'darkred' : '#08f',
                    opacity: this.props.distance ? Math.max(0, 1 - this.props.distance / 10) : 0,
                    textShadow: '0 0 4px white',
                    filter: `hue-rotate(-${(this.props.distance - 1) * 45}deg)`,
                }}
            >
                {this.props.distance}
            </span>
        );

        let passabilityClassName = paramCase(this.props.passability.enumKey);

        return (
            <div
                className={classNames({
                    'arena-cell': true,
                    'selectable': this.props.selectable,
                    'selected': this.props.selected,
                    [passabilityClassName]: true,
                })}
                style={{
                    '--cell-size': this.context.gridProps.cellSize,
                    left: this.props.position.x + 'px',
                    top: this.props.position.y + 'px',
                }}
                onClick={e => this.props.onClick?.(this, e)}
                onMouseMove={e => this.props.onMouseMove?.(this, e)}
                onMouseEnter={e => this.props.onMouseEnter?.(this, e)}
                onMouseLeave={e => this.props.onMouseLeave?.(this, e)}
            >
                <svg
                    viewBox='7 0 128 148'
                    preserveAspectRatio='none'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path className='hexagon' d='
                        M 61 5.7735
                        a 20 20 0 0 1 20 0 l 44.0859 25.453
                        a 20 20 0 0 1 10 17.3205 l 0 50.906
                        a 20 20 0 0 1 -10 17.3205 l -44.0859 25.453
                        a 20 20 0 0 1 -20 0 l -44.0859 -25.453
                        a 20 20 0 0 1 -10 -17.3205 l 0 -50.906
                        a 20 20 0 0 1 10 -17.3205 l 44.0859 -25.453
                    '/>
                </svg>
                <span className='content'>
                    {this.props.content}
                    {distanceSpan}
                </span>
                <span className='coords'>
                    {this.props.axialPosition.x} {this.props.axialPosition.y}
                </span>
            </div>
        );
    }
}