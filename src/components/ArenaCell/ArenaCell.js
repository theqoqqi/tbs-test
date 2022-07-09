import './ArenaCell.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Vector from '../../cls/util/Vector.js';

export default class ArenaCell extends React.Component {

    static propTypes = {
        id: PropTypes.number.isRequired,
        position: PropTypes.instanceOf(Vector),
        selectable: PropTypes.bool,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        distance: PropTypes.number,
        coords: PropTypes.string,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    static defaultProps = {
        content: '',
    };

    render() {
        // Генератор хексов
        // https://weareoutman.github.io/rounded-polygon/

        let distanceSpan = this.props.distance
            && (
                <span
                    className='distance'
                    style={{
                        color: this.props.distance === -1 ? 'darkred' : '#08f',
                        opacity: 1 - this.props.distance / 10,
                        textShadow: '0 0 4px white',
                        filter: `hue-rotate(-${this.props.distance * 45 - 45}deg)`,
                    }}
                >
                    {this.props.distance}
                </span>
            );

        return (
            <div
                className={classNames({
                    'arena-cell': true,
                    'selectable': this.props.selectable,
                })}
                style={{
                    left: this.props.position.x + 'px',
                    top: this.props.position.y + 'px',
                }}
                onClick={e => this.props.onClick(this, e)}
                onMouseEnter={e => this.props.onMouseEnter?.(this, e)}
                onMouseLeave={e => this.props.onMouseLeave?.(this, e)}
            >
                <svg
                    viewBox='8 0 128 148'
                    preserveAspectRatio='none'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path className='hexagon' d='
                        M 61 5.7735 a 20 20 0 0 1 20 0
                        l 44.0859 25.453 a 20 20 0 0 1 10 17.3205
                        l 0 50.906 a 20 20 0 0 1 -10 17.3205
                        l -44.0859 25.453 a 20 20 0 0 1 -20 0
                        l -44.0859 -25.453 a 20 20 0 0 1 -10 -17.3205
                        l 0 -50.906 a 20 20 0 0 1 10 -17.3205
                        l 44.0859 -25.453
                    '/>
                </svg>
                <span className='content'>
                    {this.props.content}
                    {distanceSpan}
                </span>
                <span className='coords'>
                    {this.props.coords}
                </span>
            </div>
        );
    }
}