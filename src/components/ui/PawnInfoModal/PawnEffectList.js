import styles from './styles/PawnEffectList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import PawnEffect from './PawnEffect.js';
import NoDataSpan from './NoDataSpan.js';
import Subtitle from './Subtitle.js';

export default class PawnEffectList extends React.Component {

    static propTypes = {
        effects: PropTypes.arrayOf(PropTypes.shape(PawnEffect.propTypes)),
    };

    render() {
        return (
            <div className={styles.pawnEffectList}>
                <Subtitle>Эффекты:</Subtitle>
                {this.props.effects.length
                    ?
                    this.props.effects.map((effect, index) => {
                        return <PawnEffect key={index} {...effect} />;
                    })
                    :
                    <div><NoDataSpan /></div>}
            </div>
        );
    }
}