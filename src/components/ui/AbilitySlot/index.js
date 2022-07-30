import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Tooltip} from '@mui/material';
import {buildStyles, CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default class AbilitySlot extends React.Component {

    static propTypes = {
        muted: PropTypes.bool,
        ready: PropTypes.bool,
        selected: PropTypes.bool,
        title: PropTypes.string,
        description: PropTypes.string,
        currentReload: PropTypes.number,
        maxReload: PropTypes.number,
        usesCharges: PropTypes.bool,
        charges: PropTypes.number,

        empty: PropTypes.bool,

        onClick: PropTypes.func,
    };

    render() {
        if (this.props.empty) {
            return (
                <div className='ability-slot empty' />
            );
        }

        let {
            image,
            title,
            description,
            currentReload,
            maxReload,
            usesCharges,
            charges,
            muted,
            ready,
            selected,
            onClick,
        } = this.props;

        return (
            <Tooltip
                classes={{ popper: 'ability-tooltip' }}
                title={(
                    <>
                        <div>
                            {title ?? '[title]'}
                        </div>
                        <div>
                            {description ?? '[description]'}
                        </div>
                    </>
                )}
                disableInteractive>
                <div
                    className={{
                        'ability-slot': true,
                        'reloading': currentReload > 0,
                        'muted': muted,
                        'ready': ready,
                        'selected': selected,
                    }}
                    style={{
                        backgroundImage: `url('${image}')`,
                    }}
                    onClick={onClick}
                >
                    {usesCharges && (
                        <span className='ability-charges'>
                            {charges}
                        </span>
                    )}
                    {currentReload > 0 && (
                        <div className='ability-reload-container'>
                            <CircularProgressbar
                                className='ability-reload'
                                value={currentReload}
                                maxValue={maxReload}
                                strokeWidth={50}
                                background={true}
                                styles={buildStyles({
                                    strokeLinecap: 'butt',
                                    pathColor: 'rgba(255, 0, 0, 0.5)',
                                    trailColor: 'transparent',
                                    backgroundColor: 'transparent',
                                })}
                            />
                        </div>
                    )}
                </div>
            </Tooltip>
        );
    }
}