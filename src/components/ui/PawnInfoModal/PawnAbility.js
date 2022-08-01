import './PawnAbility.css';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../util/Tooltip';

export default class PawnAbility extends React.Component {

    static propTypes = {
        image: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        currentReload: PropTypes.number,
        currentCharges: PropTypes.number,
    };

    render() {
        let currentReload = this.props.currentReload;
        let currentCharges = this.props.currentCharges;

        let $tooltip = (
            <>
                <div className='tooltip-title'>{this.props.title}</div>
                <div className='tooltip-description'>{this.props.description}</div>
                {currentReload > 0 && <>Перезарядка: {currentReload}</>}
            </>
        );

        return (
            <Tooltip
                classes={{ popper: 'pawn-ability-tooltip' }}
                title={$tooltip}
                disableInteractive>
                <div className='pawn-ability'>
                    <div className='pawn-ability-icon' style={{display: "inline-block"}}>
                        <img src={this.props.image} alt={this.props.title} />
                    </div>
                    <span className='pawn-ability-title'>
                        {this.props.title}
                    </span>
                    {' '}
                    {currentCharges > 0 && <>({currentCharges})</>}
                </div>
            </Tooltip>
        );
    }
}
