import styles from './index.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Popover} from '@mui/material';
import Vector from '../../../cls/util/Vector.js';
import MoveInfo from '../../../cls/util/info/MoveInfo.js';

export default class MoveInfoTooltip extends React.Component {

    static propTypes = {
        opened: PropTypes.bool,
        position: PropTypes.instanceOf(Vector),
        moveInfo: PropTypes.instanceOf(MoveInfo),
    };

    static defaultProps = {
        opened: false,
        position: new Vector(0, 0),
    };

    render() {
        let $infos = this.getActionInfos();

        return (
            <Popover
                classes={{
                    root: styles.actionInfoTooltip,
                    paper: styles.tooltipContent,
                }}
                open={this.props.opened}
                hideBackdrop={true}

                anchorReference='anchorPosition'
                anchorPosition={{
                    left: this.props.position.x,
                    top: this.props.position.y,
                }}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                }}
                transformOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom',
                }}
            >
                {$infos}
            </Popover>
        );
    }

    getActionInfos() {
        return this.props.moveInfo?.actionInfos.map((info, index) => {
            return (
                <div className='action-info-row' key={index}>
                    <div className='target-name'>
                        {info.targetName}
                    </div>
                    <div className='titled-range'>
                        Урон: {info.minDamage} - {info.maxDamage}
                    </div>
                    <div className='titled-range'>
                        Погибает: {info.minKills} - {info.maxKills}
                    </div>
                    {info.willHitback && (
                        <div className='hitback'>
                            Враг ответит на удар
                        </div>
                    )}
                </div>
            );
        });
    }
}