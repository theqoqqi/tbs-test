import './index.css';
import React from 'react';
import {Tooltip as MuiTooltip} from '@mui/material';
import classNames from 'classnames';

export default class Tooltip extends React.Component {

    render() {
        let classes = this.props.classes ?? {};
        classes.popper = classNames('tooltip', classes.popper);

        return (
            <MuiTooltip
                {...this.props}
                children={this.props.children}
                classes={classes}
            />
        );
    }
}