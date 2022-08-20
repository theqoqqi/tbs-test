import styles from './styles/PawnFeatureList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Subtitle from './Subtitle.js';
import WithSeparators from '../../util/WithSeparators';
import NoDataSpan from './NoDataSpan.js';
import PawnFeature from './PawnFeature.js';

export default class PawnFeatureList extends React.Component {

    static propTypes = {
        features: PropTypes.arrayOf(PropTypes.shape(PawnFeature.propTypes)),
    };

    render() {

        return (
            <div className={styles.pawnFeatureList}>
                <Subtitle>Особенности:</Subtitle>
                {' '}
                <WithSeparators separator=', '>
                    {this.props.features.length
                        ?
                        this.props.features.map((feature, index) => {
                            return <PawnFeature key={index} {...feature} />;
                        })
                        :
                        <NoDataSpan />}
                </WithSeparators>
            </div>
        );
    }
}
