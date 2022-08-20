import styles from './styles/index.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../util/Modal';
import MovementType from '../../../cls/enums/MovementType.js';
import Ranges from '../../../cls/util/Ranges.js';
import Resistances from '../../../cls/util/Resistances.js';
import Vector from '../../../cls/util/Vector.js';
import PawnParameter from './PawnParameter.js';
import ResistancesTooltipContent from './ResistancesTooltipContent.js';
import DamageRangesTooltipContent from './DamageRangesTooltipContent.js';
import PawnAbilityList from './PawnAbilityList.js';
import PawnEffectList from './PawnEffectList.js';
import PawnFeatureList from './PawnFeatureList.js';

export default class PawnInfoModal extends React.Component {

    static propTypes = {
        opened: PropTypes.bool,
        position: PropTypes.instanceOf(Vector),
        pawnInfo: PropTypes.shape({
            image: PropTypes.string,
            unitTitle: PropTypes.string,

            attack: PropTypes.number,
            baseAttack: PropTypes.number,

            defence: PropTypes.number,
            baseDefence: PropTypes.number,

            initiative: PropTypes.number,
            baseInitiative: PropTypes.number,

            currentActionPoints: PropTypes.number,
            maxActionPoints: PropTypes.number,
            baseMaxActionPoints: PropTypes.number,

            criticalHitChance: PropTypes.number,
            baseCriticalHitChance: PropTypes.number,

            currentHealth: PropTypes.number,
            maxHealth: PropTypes.number,
            baseMaxHealth: PropTypes.number,

            resistances: PropTypes.instanceOf(Resistances),

            damageRanges: PropTypes.instanceOf(Ranges),

            movementType: PropTypes.oneOf(Object.values(MovementType)),

            features: PawnFeatureList.propTypes.features,
            effects: PawnEffectList.propTypes.effects,
            abilities: PawnAbilityList.propTypes.abilities,
        }),
        onClose: PropTypes.func,
    };

    render() {
        let {
            pawnInfo: p,
            opened,
            position,
            onClose
        } = this.props;

        if (!p) {
            return null;
        }

        let minDamage = p.damageRanges.combinedMin;
        let maxDamage = p.damageRanges.combinedMax;

        return (
            <Modal
                className={styles.pawnInfoModal}
                contentProps={{
                    className: styles.modalContent,
                }}
                open={opened}
                hideBackdrop={true}
                onClose={onClose}
                style={{
                    right: position.x + 'px',
                    top: position.y + 'px',
                }}
            >
                <header>
                    <h2>{p.unitTitle}</h2>
                </header>
                <main>
                    <div className={styles.mainPawnInfo}>
                        <div className={styles.pawnPortrait}>
                            <img src={p.image} alt={p.unitTitle} />
                        </div>
                        <div className={styles.pawnParameterList}>
                            <PawnParameter
                                title='Атака'
                                value={p.attack}
                                baseValue={p.baseAttack}
                            />
                            <PawnParameter
                                title='Защита'
                                value={p.defence}
                                baseValue={p.baseDefence}
                                tooltip={<ResistancesTooltipContent resistances={p.resistances} />}
                            />
                            <PawnParameter
                                title='Инициатива'
                                value={p.initiative}
                                baseValue={p.baseInitiative}
                            />
                            <PawnParameter
                                title='Скорость'
                                current={p.currentActionPoints}
                                value={p.maxActionPoints}
                                baseValue={p.baseMaxActionPoints}
                            />
                            <PawnParameter
                                title='Крит'
                                value={Math.round(p.criticalHitChance * 100)}
                                baseValue={Math.round(p.baseCriticalHitChance * 100)}
                                format={value => value + ' %'}
                            />
                            <PawnParameter
                                title='Урон'
                                value={`${minDamage} - ${maxDamage}`}
                                tooltip={<DamageRangesTooltipContent damageRanges={p.damageRanges} />}
                            />
                            <PawnParameter
                                title='Здоровье'
                                current={p.currentHealth}
                                value={p.maxHealth}
                                baseValue={p.baseMaxHealth}
                            />
                            <PawnParameter
                                title=''
                                value={p.movementType.enumKey}
                            />
                        </div>
                    </div>
                    <PawnFeatureList features={p.features} />
                    <PawnEffectList effects={p.effects} />
                    <PawnAbilityList abilities={p.abilities} />
                </main>
                <footer>
                    <button className={styles.closeButton} onClick={onClose}>
                        Закрыть
                    </button>
                </footer>
            </Modal>
        );
    }
}