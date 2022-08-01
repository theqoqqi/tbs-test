import './PawnFeature.css';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../util/Tooltip';

export default class PawnFeature extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
    };

    render() {
        let $tooltip = (
            <>
                <div className='tooltip-title'>{this.props.title}</div>
                <div className='tooltip-description'>{this.props.description}</div>
            </>
        );

        return (
            <Tooltip
                classes={{ popper: 'pawn-feature-tooltip' }}
                title={$tooltip}
                disableInteractive>
                <div className='pawn-feature'>
                    <span className='pawn-feature-title'>
                        {this.props.title}
                    </span>
                </div>
            </Tooltip>
        );
    }
}
