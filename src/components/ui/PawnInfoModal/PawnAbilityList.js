import styles from './styles/PawnAbilityList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import PawnAbility from './PawnAbility.js';
import NoDataSpan from './NoDataSpan.js';
import Subtitle from './Subtitle.js';

export default class PawnAbilityList extends React.Component {

    static propTypes = {
        abilities: PropTypes.arrayOf(PropTypes.shape(PawnAbility.propTypes)),
    };

    render() {
        return (
            <div className={styles.pawnAbilityList}>
                <Subtitle>Способности:</Subtitle>
                {this.props.abilities.length
                    ?
                    this.props.abilities.map((ability, index) => {
                        return <PawnAbility key={index} {...ability} />;
                    })
                    :
                    <div><NoDataSpan /></div>}
            </div>
        );
    }
}