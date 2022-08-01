import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../util/Modal';
import MovementType from '../../../cls/enums/MovementType.js';
import Ranges from '../../../cls/util/Ranges.js';
import Resistances from '../../../cls/util/Resistances.js';
import Vector from '../../../cls/util/Vector.js';
import WithSeparators from '../../util/WithSeparators';
import PawnParameter from './PawnParameter.js';
import PawnFeature from './PawnFeature.js';
import PawnEffect from './PawnEffect.js';
import PawnAbility from './PawnAbility.js';
import ResistancesTooltipContent from './ResistancesTooltipContent.js';
import DamageRangesTooltipContent from './DamageRangesTooltipContent.js';

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

            features: PropTypes.arrayOf(PropTypes.shape(PawnFeature.propTypes)),
            effects: PropTypes.arrayOf(PropTypes.shape(PawnEffect.propTypes)),
            abilities: PropTypes.arrayOf(PropTypes.shape(PawnAbility.propTypes)),
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

        let $features = p.features.map((feature, index) => {
            return <PawnFeature key={index} {...feature} />;
        });

        let $effects = p.effects.map((effect, index) => {
            return <PawnEffect key={index} {...effect} />;
        });

        let $abilities = p.abilities.map((ability, index) => {
            return <PawnAbility key={index} {...ability} />;
        });

        let $noData = <span style={{color: 'gray'}}>Нет</span>;

        return (
            <Modal
                className='pawn-info-modal'
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
                    <div className='main-pawn-info'>
                        <div className='pawn-portrait'>
                            <img src={p.image} alt={p.unitTitle} />
                        </div>
                        <div className='pawn-parameter-list'>
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
                    <div className='pawn-feature-list'>
                        <span className='subtitle'>Особенности:</span>
                        {' '}
                        <WithSeparators separator=', '>
                            {$features.length ? $features : $noData}
                        </WithSeparators>
                    </div>
                    <div className='pawn-effect-list'>
                        <span className='subtitle'>Эффекты:</span>
                        {$effects.length ? $effects : <div>{$noData}</div>}
                    </div>
                    <div className='pawn-ability-list'>
                        <span className='subtitle'>Способности:</span>
                        {$abilities.length ? $abilities : <div>{$noData}</div>}
                    </div>
                </main>
                <footer>
                    <button className='close-button' onClick={onClose}>
                        Закрыть
                    </button>
                </footer>
            </Modal>
        );
    }
}