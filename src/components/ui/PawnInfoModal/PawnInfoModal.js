import './PawnInfoModal.css';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../util/Modal/Modal.js';
import MovementType from '../../../cls/enums/MovementType.js';
import Ranges from '../../../cls/util/Ranges.js';
import Resistances from '../../../cls/util/Resistances.js';
import {Tooltip} from '@mui/material';
import DamageType from '../../../cls/enums/DamageType.js';
import Vector from '../../../cls/util/Vector.js';

class PawnParameter extends React.Component {

    static valueType = PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.element,
    ]);

    static propTypes = {
        title: PropTypes.string,
        value: this.valueType,
        baseValue: this.valueType,
        noAside: PropTypes.bool,
    };

    render() {
        return (
            <Tooltip
                classes={{ popper: 'resistances-tooltip' }}
                title={this.props.tooltip ?? ''}
                open={this.props.tooltip ? undefined : false}
                disableInteractive>
                <div className='pawn-parameter'>
                    <main>
                        <div className='pawn-parameter-title'>
                            {this.props.title}
                        </div>
                        <div className='pawn-parameter-value'>
                            {this.props.value}
                        </div>
                    </main>
                    {!this.props.noAside && (
                        <aside>
                            <div className='pawn-parameter-base-value'>
                                {this.props.baseValue !== undefined
                                    ? `(${this.props.baseValue})`
                                    : null}
                            </div>
                        </aside>
                    )}
                </div>
            </Tooltip>
        );
    }
}

class ResistancesTooltipContent extends React.Component {
    render() {
        let $parameters = DamageType.enumValues.map((damageType, index) => {
            let resistance = this.props.resistances.get(damageType);

            return (
                <PawnParameter
                    key={index}
                    title={damageType.enumKey}
                    value={resistance * 100 + ' %'}
                    noAside
                />
            );
        });

        return <>{$parameters}</>;
    }
}

class DamageRangesTooltipContent extends React.Component {
    render() {
        let $parameters = this.props.damageRanges.keys().map((damageType, index) => {
            let min = this.props.damageRanges.getMin(damageType);
            let max = this.props.damageRanges.getMax(damageType);

            return (
                <PawnParameter
                    key={index}
                    title={damageType.enumKey}
                    value={`${min} - ${max}`}
                    noAside
                />
            );
        });

        return <>{$parameters}</>;
    }
}

export default class PawnInfoModal extends React.Component {

    static propTypes = {
        opened: PropTypes.bool,
        position: PropTypes.instanceOf(Vector),
        pawnInfo: PropTypes.shape({
            attack: PropTypes.number,
            baseAttack: PropTypes.number,

            defence: PropTypes.number,
            baseDefence: PropTypes.number,

            initiative: PropTypes.number,
            baseInitiative: PropTypes.number,

            currentSpeed: PropTypes.number,
            speed: PropTypes.number,
            baseSpeed: PropTypes.number,

            criticalHitChance: PropTypes.number,
            baseCriticalHitChance: PropTypes.number,

            currentHealth: PropTypes.number,
            maxHealth: PropTypes.number,
            baseMaxHealth: PropTypes.number,

            resistances: PropTypes.instanceOf(Resistances),

            damageRanges: PropTypes.instanceOf(Ranges),

            movementType: PropTypes.oneOf(Object.values(MovementType)),
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
                className='pawn-info-modal'
                open={opened}
                hideBackdrop={true}
                onClose={onClose}
                style={{
                    right: position.x + 'px',
                    top: position.y + 'px',
                }}
            >
                <main>
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
                        value={`${p.currentSpeed} / ${p.speed}`}
                        baseValue={p.baseSpeed}
                    />
                    <PawnParameter
                        title='Крит'
                        value={p.criticalHitChance * 100 + ' %'}
                        baseValue={p.baseCriticalHitChance * 100}
                    />
                    <PawnParameter
                        title='Урон'
                        value={`${minDamage} - ${maxDamage}`}
                        tooltip={<DamageRangesTooltipContent damageRanges={p.damageRanges} />}
                    />
                    <PawnParameter
                        title='Здоровье'
                        value={`${p.currentHealth} / ${p.maxHealth}`}
                        baseValue={p.baseMaxHealth}
                    />
                    <PawnParameter
                        title=''
                        value={p.movementType.enumKey}
                    />
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