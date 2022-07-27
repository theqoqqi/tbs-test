import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import Vector from '../../../cls/util/Vector.js';
import classNames from 'classnames';
import PawnType from '../../../cls/enums/PawnType.js';

export default class ArenaPawn extends React.Component {

    static propTypes = {
        id: PropTypes.number.isRequired,
        pawnType: PropTypes.instanceOf(PawnType),
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
        showHealthBar: PropTypes.bool,
        showEffects: PropTypes.bool,
        showStackSize: PropTypes.bool,
        showTurnOrder: PropTypes.bool,

        onClick: PropTypes.func,
        onRightClick: PropTypes.func,
        onMouseMove: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    render() {
        let {
            pawnType,
            position,
            stackSize,
            health,
            maxHealth,
            name,
            teamColor,
            debuffs,
            buffs,
            turnOrder,
            showHealthBar,
            showEffects,
            showStackSize,
            showTurnOrder,

            onClick,
            onRightClick,
            onMouseMove,
            onMouseEnter,
            onMouseLeave,
        } = this.props;

        let showStatusBar = showStackSize || showEffects || showTurnOrder;

        return (
            <div
                className={classNames('arena-pawn', {
                    [pawnType.enumKey.toLowerCase()]: true,
                })}
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
                {showHealthBar && (
                    <div className='health-bar' style={{'--percent': health / maxHealth}}>
                        <div className='health' />
                    </div>
                )}
                {showStatusBar && (
                    <div className='status-bar'>
                        {showStackSize && (
                            <span className='effects'>
                                <span className={classNames('debuffs', {muted: debuffs === 0})}>
                                    {debuffs}
                                </span>
                                <span className='separator' />
                                <span className={classNames('buffs', {muted: buffs === 0})}>
                                    {buffs}
                                </span>
                            </span>
                        )}
                        {showEffects && (
                            <span className='stack-size'>
                                {stackSize}
                            </span>
                        )}
                        {showTurnOrder && (
                            <span className='turn-order' style={{'--order': turnOrder ?? 0}}>
                                {turnOrder ?? '×'}
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }
}