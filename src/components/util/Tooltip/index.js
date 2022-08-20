import styles from './index.module.css';
import React from 'react';
import {Tooltip as MuiTooltip} from '@mui/material';
import classNames from 'classnames';

class Tooltip extends React.Component {

    static Title = TooltipTitle;

    static Description = TooltipDescription;

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

function TooltipTitle(props) {
    return <div {...props} className={styles.tooltipTitle}>{props.children}</div>;
}

function TooltipDescription(props) {
    return <div {...props} className={styles.tooltipDescription}>{props.children}</div>;
}

export default Tooltip;