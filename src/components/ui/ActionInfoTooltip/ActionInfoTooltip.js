import './ActionInfoTooltip.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Popover} from '@mui/material';
import Vector from '../../../cls/util/Vector.js';

export default class ActionInfoTooltip extends React.Component {

    static propTypes = {
        opened: PropTypes.bool,
        position: PropTypes.instanceOf(Vector),
        actionInfo: PropTypes.arrayOf(PropTypes.shape({
            minDamage: PropTypes.number,
            maxDamage: PropTypes.number,
            minKills: PropTypes.number,
            maxKills: PropTypes.number,
        })),
    };

    static defaultProps = {
        opened: false,
        position: new Vector(0, 0),
    };

    render() {
        let $infos = this.props.actionInfo?.map((info, index) => {
            return (
                <div className='action-info-row' key={index}>
                    <div className='damage-range'>
                        Урон: {info.minDamage} - {info.maxDamage}
                    </div>
                    <div className='kill-range'>
                        Погибает: {info.minKills} - {info.maxKills}
                    </div>
                </div>
            );
        });

        return (
            <Popover
                classes={{
                    root: 'action-info-tooltip',
                    paper: 'tooltip-content',
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
}