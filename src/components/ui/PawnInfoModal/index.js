import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../util/Modal';
import MovementType from '../../../cls/enums/MovementType.js';
import Ranges from '../../../cls/util/Ranges.js';
import Resistances from '../../../cls/util/Resistances.js';
import {Tooltip} from '@mui/material';
import DamageType from '../../../cls/enums/DamageType.js';
import Vector from '../../../cls/util/Vector.js';
import WithSeparators from '../../util/WithSeparators';
import EffectType from '../../../cls/enums/EffectType.js';
import classNames from 'classnames';

class PawnParameter extends React.Component {

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
        } = this.props;

        let valueText = format(value, current);

        let showAsideText = baseValue !== undefined && value !== baseValue;

        return (
            <Tooltip
                classes={{ popper: 'resistances-tooltip' }}
                title={tooltip ?? ''}
                open={tooltip ? undefined : false}
                disableInteractive>
                <div className='pawn-parameter'>
                    <main>
                        <div className='pawn-parameter-title'>
                            {title}
                        </div>
                        <div className='pawn-parameter-value'>
                            {valueText}
                        </div>
                    </main>
                    {!noAside && (
                        <aside>
                            <div className='pawn-parameter-base-value'>
                                {showAsideText && `(${baseValue})`}
                            </div>
                        </aside>
                    )}
                </div>
            </Tooltip>
        );
    }
}

class PawnFeature extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
    };

    render() {
        let $tooltip = (
            <>
                <div className='tooltip-title'>{this.props.title}</div>
                <div className='tooltip-description'>{this.props.description}</div>
            </>
        );

        return (
            <Tooltip
                classes={{ popper: 'pawn-feature-tooltip' }}
                title={$tooltip}
                disableInteractive>
                <div className='pawn-feature'>
                    <span className='pawn-feature-title'>
                        {this.props.title}
                    </span>
                </div>
            </Tooltip>
        );
    }
}

class PawnEffect extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        duration: PropTypes.number,
        effectType: PropTypes.instanceOf(EffectType),
    };

    render() {
        let $tooltip = (
            <>
                <div className='tooltip-title'>{this.props.title}</div>
                <div className='tooltip-description'>{this.props.description}</div>
            </>
        );

        let duration = this.props.duration;

        return (
            <Tooltip
                classes={{ popper: 'pawn-effect-tooltip' }}
                title={$tooltip}
                disableInteractive>
                <div
                    className={classNames('pawn-effect', {
                        [this.props.effectType.enumKey.toLowerCase()]: true,
                    })}
                >
                    <span className='pawn-effect-title'>
                        {this.props.title}
                    </span>
                    {' '}
                    {duration > 0 && <>({duration})</>}
                </div>
            </Tooltip>
        );
    }
}

class PawnAbility extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        currentReload: PropTypes.number,
        currentCharges: PropTypes.number,
    };

    render() {
        let currentReload = this.props.currentReload;
        let currentCharges = this.props.currentCharges;

        let $tooltip = (
            <>
                <div className='tooltip-title'>{this.props.title}</div>
                <div className='tooltip-description'>{this.props.description}</div>
                {currentReload > 0 && <>Перезарядка: {currentReload}</>}
            </>
        );

        return (
            <Tooltip
                classes={{ popper: 'pawn-ability-tooltip' }}
                title={$tooltip}
                disableInteractive>
                <div className='pawn-ability'>
                    <span className='pawn-ability-title'>
                        {this.props.title}
                    </span>
                    {' '}
                    {currentCharges > 0 && <>({currentCharges})</>}
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
                <main>
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
                            baseValue={p.baseCriticalHitChance * 100}
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