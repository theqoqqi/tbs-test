import './PawnEffect.css';
import React from 'react';
import PropTypes from 'prop-types';
import EffectType from '../../../cls/enums/EffectType.js';
import Tooltip from '../../util/Tooltip';
import classNames from 'classnames';

export default class PawnEffect extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        duration: PropTypes.number,
        effectType: PropTypes.instanceOf(EffectType),
    };

    render() {
        let $tooltip = (
            <>
                <div className='tooltip-title'>{this.props.title}</div>
                <div className='tooltip-description'>{this.props.description}</div>
            </>
        );

        let duration = this.props.duration;

        return (
            <Tooltip
                classes={{ popper: 'pawn-effect-tooltip' }}
                title={$tooltip}
                disableInteractive>
                <div
                    className={classNames('pawn-effect', {
                        [this.props.effectType.enumKey.toLowerCase()]: true,
                    })}
                >
                    <div className='pawn-effect-icon' style={{display: "inline-block"}}>
                        <img src={this.props.image} alt={this.props.title} />
                    </div>
                    <span className='pawn-effect-title'>
                        {this.props.title}
                    </span>
                    {' '}
                    {duration > 0 && <>({duration})</>}
                </div>
            </Tooltip>
        );
    }
}
