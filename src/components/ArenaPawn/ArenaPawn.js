import './ArenaPawn.css';
import React from 'react';
import PropTypes from 'prop-types';
import PawnProps from '../../cls/context/PawnProps.js';
import Vector from '../../cls/util/Vector.js';

export default class ArenaPawn extends React.Component {

    static propTypes = {
        id: PropTypes.number.isRequired,
        position: PropTypes.instanceOf(Vector),
        pawnProps: PropTypes.instanceOf(PawnProps).isRequired,
        name: PropTypes.string,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    render() {
        return (
            <div
                className='arena-pawn'
                style={{
                    left: this.props.position.x + 'px',
                    top: this.props.position.y + 'px',
                }}
                onClick={this.props.onClick}
                onMouseEnter={e => this.props.onMouseEnter?.(this, e)}
                onMouseLeave={e => this.props.onMouseLeave?.(this, e)}
            >
                {this.props.name}
                <div className='stats'>
                    <span className='damage'>
                        {this.props.pawnProps.damage}
                    </span>
                    <span className='health'>
                        {this.props.pawnProps.health}
                    </span>
                </div>
            </div>
        );
    }
}