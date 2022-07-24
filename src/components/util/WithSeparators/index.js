import React from 'react';
import PropTypes from 'prop-types';

export default class WithSeparators extends React.Component {

    static propTypes = {
        separator: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
    };

    render() {
        let children = this.props.children;

        if (!Array.isArray(children)) {
            children = [children];
        }

        return (
            <>
                {children.map((child, index) => [
                    index > 0 && this.props.separator,
                    child
                ])}
            </>
        );
    }
}