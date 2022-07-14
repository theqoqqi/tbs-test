import './ArenaPawn.css';
import React from 'react';
import PropTypes from 'prop-types';
import Vector from '../../cls/util/Vector.js';

export default class ArenaPawn extends React.Component {

    static propTypes = {
        id: PropTypes.number.isRequired,
        axialPosition: PropTypes.instanceOf(Vector),
        position: PropTypes.instanceOf(Vector),
        damage: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
        health: PropTypes.number.isRequired,
        maxHealth: PropTypes.number.isRequired,
        name: PropTypes.string,
        teamColor: PropTypes.string,
        onClick: PropTypes.func,
        onMouseMove: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    render() {
        let healthPercent = this.props.health / this.props.maxHealth;

        return (
            <div
                className='arena-pawn'
                style={{
                    '--team-color': this.props.teamColor,
                    left: this.props.position.x + 'px',
                    top: this.props.position.y + 'px',
                }}
                onClick={e => this.props.onClick?.(this, e)}
                onMouseMove={e => this.props.onMouseMove?.(this, e)}
                onMouseEnter={e => this.props.onMouseEnter?.(this, e)}
                onMouseLeave={e => this.props.onMouseLeave?.(this, e)}
            >
                {this.props.name}
                <div className='stats'>
                    <span className='damage'>
                        {this.props.damage}
                    </span>
                </div>
                <div className='health-bar' style={{'--percent': healthPercent}}>
                    <div className='health' />
                </div>
                <span className='count'>
                    {this.props.count}
                </span>
            </div>
        );
    }

}