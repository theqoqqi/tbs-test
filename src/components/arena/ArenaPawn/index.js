import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import Vector from '../../../cls/util/Vector.js';
import classNames from 'classnames';

export default class ArenaPawn extends React.Component {

    static propTypes = {
        id: PropTypes.number.isRequired,
        axialPosition: PropTypes.instanceOf(Vector),
        position: PropTypes.instanceOf(Vector),
        stackSize: PropTypes.number.isRequired,
        health: PropTypes.number.isRequired,
        maxHealth: PropTypes.number.isRequired,
        name: PropTypes.string,
        teamColor: PropTypes.string,
        debuffs: PropTypes.number,
        buffs: PropTypes.number,
        turnOrder: PropTypes.number,
        showStatusBar: PropTypes.bool,

        onClick: PropTypes.func,
        onRightClick: PropTypes.func,
        onMouseMove: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    render() {
        let {
            position,
            stackSize,
            health,
            maxHealth,
            name,
            teamColor,
            debuffs,
            buffs,
            turnOrder,
            showStatusBar,
            
            onClick,
            onRightClick,
            onMouseMove,
            onMouseEnter,
            onMouseLeave,
        } = this.props;

        return (
            <div
                className='arena-pawn'
                style={{
                    '--team-color': teamColor,
                    left: Math.round(position.x) + 'px',
                    top: Math.round(position.y) + 'px',
                }}
                onClick={e => onClick?.(this, e)}
                onContextMenu={e => onRightClick?.(this, e)}
                onMouseMove={e => onMouseMove?.(this, e)}
                onMouseEnter={e => onMouseEnter?.(this, e)}
                onMouseLeave={e => onMouseLeave?.(this, e)}
            >
                {name}
                <div className='health-bar' style={{'--percent': health / maxHealth}}>
                    <div className='health' />
                </div>
                {showStatusBar && (
                    <div className='status-bar'>
                        <span className='effects'>
                            <span className={classNames('debuffs', {muted: debuffs === 0})}>
                                {debuffs}
                            </span>
                            <span className='separator' />
                            <span className={classNames('buffs', {muted: buffs === 0})}>
                                {buffs}
                            </span>
                        </span>
                        <span className='stack-size'>
                            {stackSize}
                        </span>
                        <span className='turn-order' style={{'--order': turnOrder ?? 0}}>
                            {turnOrder ?? '×'}
                        </span>
                    </div>
                )}
            </div>
        );
    }
}