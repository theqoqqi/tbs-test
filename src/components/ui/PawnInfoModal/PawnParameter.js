import styles from './styles/PawnParameter.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../util/Tooltip';

export default class PawnParameter extends React.Component {

    static valueType = PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.element,
    ]);

    static propTypes = {
        tooltip: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
        title: PropTypes.string,
        current: this.valueType,
        value: this.valueType,
        baseValue: this.valueType,
        noAside: PropTypes.bool,
        format: PropTypes.func,
        containerProps: PropTypes.object,
    };

    static defaultProps = {
        format: (value, current) =>
            current === undefined
                ? value
                : `${current} / ${value}`,
    };

    render() {
        let {
            tooltip,
            title,
            current,
            value,
            baseValue,
            noAside,
            format,
            containerProps,
        } = this.props;

        let valueText = format(value, current);

        let showAsideText = baseValue !== undefined && value !== baseValue;

        return (
            <Tooltip
                classes={{ popper: styles.pawnParameterTooltip }}
                title={tooltip ?? ''}
                open={tooltip ? undefined : false}
                disableInteractive>
                <div {...containerProps} className={styles.pawnParameter}>
                    <main>
                        <div className={styles.title}>
                            {title}
                        </div>
                        <div className={styles.value}>
                            {valueText}
                        </div>
                    </main>
                    {!noAside && (
                        <aside>
                            <div className={styles.baseValue}>
                                {showAsideText && `(${baseValue})`}
                            </div>
                        </aside>
                    )}
                </div>
            </Tooltip>
        );
    }
}