import './App.css';
import React from 'react';
import PropTypes from 'prop-types';
import Arena from './components/arena/Arena';
import GameContext from './cls/context/GameContext.js';
import HexagonUtils from './cls/util/HexagonUtils.js';
import PawnInfoModal from './components/ui/PawnInfoModal';
import Vector from './cls/util/Vector.js';
import PassabilityType from './cls/enums/PassabilityType.js';
import MoveInfoTooltip from './components/ui/MoveInfoTooltip';
import PawnControls from './components/ui/PawnControls';
import AbilitySlot from './cls/enums/AbilitySlot.js';
import SplashLayer from './components/ui/SplashLayer';
import PawnDamageReceivedEvent from './cls/events/types/PawnDamageReceivedEvent.js';
import Fight from './cls/fight/Fight.js';
import EffectType from './cls/enums/EffectType.js';
import ActionQueueStartEvent from './cls/events/types/ActionQueueStartEvent.js';
import ActionQueueStopEvent from './cls/events/types/ActionQueueStopEvent.js';
import GamecycleTurnStartEvent from './cls/events/types/GamecycleTurnStartEvent.js';
import {arenaData, armies} from './fightInit.js';
import {GlobalHotKeys} from 'react-hotkeys';
import FightSummaryModal from './components/ui/FightSummaryModal';
import GamecycleGameOverEvent from './cls/events/types/GamecycleGameOverEvent.js';
import Ranges from './cls/util/Ranges.js';
import Locale from './cls/localization/Locale.js';
import AbilityVars from './cls/localization/AbilityVars.js';

const globalKeyMap = {
    WAIT: {
        name: 'Wait move',
        sequences: ['w'],
    },
    DEFENCE: {
        name: 'Wait move',
        sequences: ['d', 'space'],
    },
    ABILITY_1: {
        name: 'Ability 1',
        sequences: ['1'],
    },
    ABILITY_2: {
        name: 'Ability 2',
        sequences: ['2'],
    },
    ABILITY_3: {
        name: 'Ability 3',
        sequences: ['3'],
    },
};

export default class App extends React.Component {

    static propTypes = {
        locale: PropTypes.instanceOf(Locale),
    };

    static CELL_SIZE = 128;

    static CELL_SPACING = 4;

    constructor(props) {
        super(props);

        let gameContext = new GameContext();

        this.locale = props.locale;

        this.arenaRef = React.createRef();
        this.splashLayerRef = React.createRef();

        this.fight = new Fight(gameContext, arenaData, armies);
        this.viewedPawn = null;
        this.selectedPawn = null;
        this.selectedAbilitySlot = null;
        this.moves = [];
        this.pathDirection = null;

        this.state = {
            cells: [],
            pawns: [],

            path: [],
            pathTargetPosition: null,

            currentPawnInfo: null,

            viewedPawnInfo: null,

            showMoveInfo: false,
            viewedMoveInfo: null,
            viewedMoveInfoPosition: null,

            fightSummary: null,
        };
    }

    componentDidMount() {
        this.fight.on(PawnDamageReceivedEvent, this.handlePawnDamageReceived);
        this.fight.on(ActionQueueStartEvent, this.handleActionQueueStart);
        this.fight.on(ActionQueueStopEvent, this.handleActionQueueStop);
        this.fight.on(GamecycleTurnStartEvent, this.handleGamecycleTurnStart);
        this.fight.on(GamecycleGameOverEvent, this.handleGamecycleGameOver);

        setInterval(this.handleAnimationFrame, 100);

        this.fight.start();
        this.setSelectedPawn(this.fight.currentPawn);
    }

    handleAnimationFrame = () => {
        this.setState({
            cells: this.getCellProps(),
            pawns: this.getPawnProps(),
            currentPawnInfo: this.selectedPawn
                ? this.collectCurrentPawnInfo(this.selectedPawn)
                : null,
            viewedPawnInfo: this.viewedPawn
                ? this.collectViewedPawnInfo(this.viewedPawn)
                : null,
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }



    //region Коллбеки событий

    handlePawnDamageReceived = ({attacker, victim, hitInfo}) => {
        let cell = this.arena.getCell(victim.position);
        let attackerPlainPosition = this.axialToPlainPosition(attacker?.position ?? Vector.ZERO);
        let victimPlainPosition = this.axialToPlainPosition(victim.position);
        let fromRight = attackerPlainPosition.x > victimPlainPosition.x;
        let damageOffset = new Vector(0, App.CELL_SIZE * -0.5);

        if (hitInfo.isEvaded) {
            this.createMissSplash(cell, damageOffset);
        } else if (hitInfo.isCriticalHit) {
            this.createCritSplash(cell, damageOffset, hitInfo.damage);
        } else {
            this.createDamageSplash(cell, damageOffset, hitInfo.damage);
        }

        if (hitInfo.kills) {
            let xOffset = App.CELL_SIZE * (fromRight ? -0.5 : 0.5);
            let killsOffset = new Vector(xOffset, 0);

            this.createKillsSplash(cell, killsOffset, hitInfo.kills);
        }
    }

    handleActionQueueStart = () => {
        this.clearSelectedPawn();
    }

    handleActionQueueStop = () => {
        this.setSelectedPawn(this.fight.currentPawn);
    }

    handleGamecycleTurnStart = () => {
        this.setSelectedPawn(this.fight.currentPawn);
    }

    handleGamecycleGameOver = () => {
        let fightSummary = this.fight.calculateSummary();

        this.setFightSummary(fightSummary);
    }

    //endregion



    //region Коллбеки интерфейса

    handleCellClick = (cellComponent) => {
        let cell = this.arena.getCell(cellComponent.props.axialPosition);
        let pawn = this.selectedPawn;

        if (pawn && cellComponent.props.selectable) {
            let move = this.moves.find(move => move.targetCell === cell);

            this.fight.makeMove(move, this.state.path);

            this.clearSelectedPawn();
        }
    }

    handleCellMouseMove = (cellComponent, event) => {
        let cell = this.arena.getCell(cellComponent.props.axialPosition);

        this.handleMouseMove(cell, event);
    }

    handleCellMouseEnter = (cellComponent) => {

    }

    handleCellMouseLeave = (cellComponent) => {
        this.clearPath();
    }

    handlePawnClick = (pawnComponent, event) => {
        let cellComponent = this.arenaRef.current.getCell(pawnComponent.props.axialPosition);

        if (cellComponent.props.selectable) {
            this.handleCellClick(cellComponent, event);
            return;
        }

        let pawn = this.arena.getAnyPawn(pawnComponent.props.axialPosition);

        if (pawn?.performsMoves) {
            if (this.selectedPawn === pawn) {
                this.clearSelectedPawn();
            } else {
                this.setSelectedPawn(pawn);
            }
        }

        console.log(pawn.toString());
    }

    handlePawnRightClick = (pawnComponent, event) => {
        event.preventDefault();

        let pawn = this.arena.getSquad(pawnComponent.props.axialPosition);

        if (pawn) {
            this.openPawnInfoModalFor(pawn);
        }
    }

    handlePawnMouseMove = (pawnComponent, event) => {
        let cell = this.arena.getCell(pawnComponent.props.axialPosition);

        this.handleMouseMove(cell, event);
    }

    handleMouseMove = (cell, event) => {
        let move = this.moves.find(move => move.targetCell === cell);

        this.tryUpdatePath(event, cell, move);
        this.updateMoveInfoTooltip(event, cell, move);
    }

    handleAbilityClick = (abilitySlot) => {
        let pawn = this.selectedPawn;

        if (!pawn) {
            return;
        }

        let ability = this.fight.getAbilityInSlot(pawn, abilitySlot);

        if (!ability || !this.fight.isAbilityReady(pawn, ability)) {
            return;
        }

        if (this.selectedAbilitySlot === abilitySlot) {
            this.setSelectedAbilitySlot(AbilitySlot.REGULAR);
            return;
        }

        if (ability.targetCollector) {
            this.setSelectedAbilitySlot(abilitySlot);
        } else {
            this.fight.applyAbility(pawn, ability);
        }
    }

    handleWaitButtonClick = () => {
        if (!this.selectedPawn || this.selectedPawn.isWaiting) {
            return;
        }

        this.fight.makeWaitMove(this.selectedPawn);
    }

    handleDefenceButtonClick = () => {
        if (!this.selectedPawn) {
            return;
        }

        this.fight.makeDefenceMove(this.selectedPawn);
    }

    //endregion



    //region Подсказки и модальные окна

    updateMoveInfoTooltip(event, cell, move) {
        if (!move) {
            this.hideMoveInfoTooltip();
            return;
        }

        let targetPawn = this.arena.getAnyPawn(move.targetCell.position);

        if (!targetPawn || targetPawn.isItem) {
            this.hideMoveInfoTooltip();
            return;
        }

        let moveInfo = this.fight.getMoveInfo(move.pawn, targetPawn, move.ability, move, this.state.path);

        if (moveInfo) {
            this.showMoveInfoTooltip(moveInfo, cell);
        } else {
            this.hideMoveInfoTooltip();
        }
    }

    openPawnInfoModalFor(pawn) {
        this.viewedPawn = pawn;
    }

    hidePawnInfoModal() {
        this.viewedPawn = null;
    }

    showMoveInfoTooltip(moveInfo, targetCell) {
        let position = this.axialToPlainPosition(targetCell.position);
        let viewportPosition = this.arenaRef.current.localPositionToViewportPosition(position);
        viewportPosition = viewportPosition.add(0, -App.CELL_SIZE / 2);

        this.setState({
            showMoveInfo: true,
            viewedMoveInfo: moveInfo,
            viewedMoveInfoPosition: viewportPosition,
        })
    }

    hideMoveInfoTooltip() {
        this.setState({
            showMoveInfo: false,
            viewedMoveInfoPosition: null,
        })
    }

    //endregion



    //region Изменение состояния и полей

    setFightSummary(fightSummary) {
        this.setState({
            fightSummary,
        });
    }

    setSelectedPawn(pawn) {
        this.selectedPawn = pawn;

        if (pawn) {
            this.setSelectedAbilitySlot(AbilitySlot.REGULAR);
        } else {
            this.clearSelectedAbilitySlot();
        }
    }

    setSelectedAbilitySlot(abilitySlot) {
        this.selectedAbilitySlot = abilitySlot;
        this.updateAvailableMoves();
    }

    setPath(path, targetPosition, pathDirection) {
        this.pathDirection = pathDirection;

        this.setState({
            path: path,
            pathTargetPosition: targetPosition,
        });
    }

    clearSelectedPawn() {
        this.selectedPawn = null;
        this.clearSelectedAbilitySlot();
        this.clearPath();
    }

    clearSelectedAbilitySlot() {
        this.selectedAbilitySlot = null;
        this.moves = [];
    }

    clearPath() {
        this.pathDirection = null;

        this.setState({
            path: [],
            pathTargetPosition: null,
        });
    }

    //endregion



    //region Обновление/поиск пути

    tryUpdatePath(event, cell, move) {
        if (!move || move.isRanged) {
            return;
        }

        let mousePosition = this.arenaRef.current.getMousePosition(event);
        let cellPlainPosition = this.axialToPlainPosition(cell.position);
        let angle = cellPlainPosition.angleTo(mousePosition);
        let direction = HexagonUtils.angleToDirection(angle);

        if (this.pathDirection !== direction) {
            this.updatePath(cell, mousePosition, direction);
        }
    }

    updatePath(cell, mousePosition, direction) {
        let pawn = this.selectedPawn;

        if (!pawn) {
            this.clearPath();
            return;
        }

        let neighborCell = this.getSuitableNeighborCell(pawn, cell, mousePosition);

        if (!neighborCell) {
            this.clearPath();
            return;
        }

        let path = this.arena.isCellPassable(cell.position)
            ? this.arena.findPath(pawn, cell.position)
            : this.arena.findPath(pawn, neighborCell.position);
        let pathTargetPosition = cell.position;

        this.setPath(path, pathTargetPosition, direction);
    }

    getDirectionToTarget(path, targetDirection) {
        let positionBeforeTarget = this.getPositionBeforeTarget(path, targetDirection);
        let angle = positionBeforeTarget.angleTo(targetDirection);

        return HexagonUtils.angleToDirection(angle);
    }

    getPositionBeforeTarget(path, targetPosition) {
        if (!path.length) {
            return null;
        }

        let lastPathPosition = path[path.length - 1];

        if (!lastPathPosition.equals(targetPosition)) {
            return lastPathPosition;
        }

        if (path.length < 2) {
            return null;
        }

        return path[path.length - 2];
    }

    getSuitableNeighborCell(movingPawn, originCell, mousePosition) {
        let cellPlainPosition = this.axialToPlainPosition(originCell.position);
        let angle = cellPlainPosition.angleTo(mousePosition);
        let orderedAngles = [
            angle,
            angle + 60,
            angle - 60,
            angle + 120,
            angle - 120,
            angle + 180,
        ];

        // TODO: sort angles by angular distance to mouse

        for (const a of orderedAngles) {
            let cell = this.arena.getNeighborCell(originCell, a);

            if (cell && this.canStrafeTo(movingPawn, cell)) {
                return cell;
            }
        }

        return null;
    }

    canStrafeTo(pawn, cell) {
        let pawnCell = this.arena.getCell(pawn.position);
        let move = this.moves.find(move => move.targetCell === cell);
        let isCellPassable = this.arena.isCellPassable(cell.position);

        return pawnCell === cell || (isCellPassable && move && move.actionPoints < move.pawn.currentActionPoints);
    }

    //endregion



    //region Сплэши

    createDamageSplash(cell, offset, damage) {
        this.createSplashAtCell(cell, offset, damage, 'damage');
    }

    createCritSplash(cell, offset, damage) {
        this.createSplashAtCell(cell, offset, damage, 'crit');
    }

    createKillsSplash(cell, offset, damage) {
        this.createSplashAtCell(cell, offset, damage, 'kills');
    }

    createMissSplash(cell, offset) {
        this.createSplashAtCell(cell, offset, 'Промах!', 'miss');
    }

    createHalfSplash(cell, offset) {
        this.createSplashAtCell(cell, offset, 'Половина!', 'half');
    }

    createSplashAtCell(cell, offset, text, type) {
        let localPosition = this.axialToPlainPosition(cell.position);
        let viewportPosition = this.arenaRef.current.localPositionToViewportPosition(localPosition);
        let position = viewportPosition.add(offset);

        this.splashLayerRef.current.createSplash(position, text, type);
    }

    //endregion



    //region Прочее

    axialToPlainPosition(axialPosition) {
        return HexagonUtils.axialToPlainPosition(axialPosition, App.CELL_SIZE, App.CELL_SPACING);
    }

    updateAvailableMoves() {
        this.moves = this.fight.getAvailableMoves(this.selectedPawn, this.selectedAbilitySlot);
    }

    getCellProps() {
        let selectedPawn = this.selectedPawn;
        let selectableCellIds = this.moves.map(move => move.targetCell.id);
        let passabilityContentMap = {
            [PassabilityType.SOARING_PASSABLE]: <span style={{fontSize: '40px'}}>S</span>,
            [PassabilityType.FLYING_PASSABLE]: <span style={{fontSize: '40px'}}>F</span>,
            [PassabilityType.IMPASSABLE]: <span style={{fontSize: '40px'}}>I</span>,
        };

        return this.arena.getAllCells().map(cell => {
            return {
                id: cell.id,
                axialPosition: cell.position,
                selectable: selectableCellIds.includes(cell.id),
                selected: selectedPawn && selectedPawn.position.equals(cell.position),
                passability: cell.passability,
                content: passabilityContentMap[cell.passability] ?? null,
            };
        });
    }

    getPawnProps() {
        return this.arena.getAllPawns().map(pawn => {
            let countEffects = ofType => {
                let effects = pawn.effects.filter(effect => !effect.isHidden && effect.effectType === ofType);

                return effects.length;
            };

            return {
                id: pawn.id,
                pawnType: pawn.pawnType,
                axialPosition: pawn.position,
                name: pawn.unitName,
                teamColor: pawn.team.hexColor,

                stackSize: pawn.stackSize,
                health: pawn.currentHealth,
                maxHealth: pawn.maxHealth,

                debuffs: countEffects(EffectType.DEBUFF),
                buffs: countEffects(EffectType.BUFF),
                turnOrder: this.fight.getPositionInTurnOrder(pawn),
                showHealthBar: !pawn.invulnerable,
                showEffects: pawn.isSquad,
                showStackSize: pawn.isSquad,
                showTurnOrder: pawn.performsMoves,
            };
        });
    }

    collectViewedPawnInfo(pawn) {
        let slots = [AbilitySlot.ABILITY_1, AbilitySlot.ABILITY_2, AbilitySlot.ABILITY_3];
        let regularAbility = this.fight.getRegularAbility(pawn);

        let features = pawn.features
            .filter(effect => !effect.isHidden)
            .map(feature => {
                return {
                    title: this.locale.get(feature.hintTitle),
                    description: this.locale.get(feature.hintDescription),
                };
            });

        let effects = pawn.effects
            .filter(effect => !effect.isHidden)
            .map(effect => {
                return {
                    image: `img/abilities/${effect.imageName}.png`,
                    title: this.locale.get(effect.hintTitle),
                    description: this.locale.get(effect.hintDescription),
                    duration: effect.duration,
                    effectType: effect.effectType,
                };
            });

        let abilities = pawn.abilities
            .filter(ability => slots.includes(ability.slot))
            .map(ability => {
                return {
                    image: `img/abilities/${ability.imageName}.png`,
                    title: this.locale.get(ability.hintTitle),
                    description: this.locale.get(ability.hintDescription, AbilityVars.from(ability)),
                    currentReload: ability.currentReload,
                    currentCharges: ability.currentCharges,
                };
            });

        let damageRanges = regularAbility?.damageRanges ?? new Ranges();

        return {
            image: `img/pawns/${pawn.unitName}.png`,
            unitTitle: this.locale.get(pawn.unitTitle),

            attack: pawn.attack,
            defence: pawn.defence,
            initiative: pawn.initiative,
            currentActionPoints: pawn.currentActionPoints,
            maxActionPoints: pawn.maxActionPoints,
            criticalHitChance: pawn.criticalHitChance,
            currentHealth: pawn.currentHealth,
            maxHealth: pawn.maxHealth,
            resistances: pawn.resistances,
            damageRanges: damageRanges,
            movementType: pawn.movementType,

            baseAttack: pawn.baseAttack,
            baseDefence: pawn.baseDefence,
            baseInitiative: pawn.baseInitiative,
            baseMaxActionPoints: pawn.baseMaxActionPoints,
            baseCriticalHitChance: pawn.baseCriticalHitChance,
            baseMaxHealth: pawn.baseMaxHealth,

            features,
            effects,
            abilities,
        };
    }

    collectCurrentPawnInfo(pawn) {
        let slots = [AbilitySlot.ABILITY_1, AbilitySlot.ABILITY_2, AbilitySlot.ABILITY_3];
        let abilities = this.fight.getReadyAbilities(pawn, slots)
            .map(ability => {
                return {
                    slot: ability.slot,
                    image: `img/abilities/${ability.imageName}.png`,
                    title: this.locale.get(ability.hintTitle),
                    description: this.locale.get(ability.hintDescription, AbilityVars.from(ability)),
                    currentReload: ability.currentReload,
                    maxReload: ability.reload,
                    usesCharges: ability.usesCharges,
                    charges: ability.currentCharges,
                    muted: this.fight.isAbilityMuted(pawn, ability),
                    ready: this.fight.isAbilityReady(pawn, ability),
                    selected: this.selectedAbilitySlot === ability.slot,
                };
            });

        return {
            abilities,
            canWait: !pawn.isWaiting,
            canDefence: true,
            currentActionPoints: pawn.currentActionPoints,
            maxActionPoints: pawn.maxActionPoints,
        };
    }

    get arena() {
        return this.fight.arena;
    }

    //endregion



    render() {
        let {
            cells,
            pawns,
            path,
            pathTargetPosition,
            currentPawnInfo,
            viewedPawnInfo,
            showMoveInfo,
            viewedMoveInfo,
            viewedMoveInfoPosition,
            fightSummary,
        } = this.state;

        let globalHandlers = {
            WAIT: this.handleWaitButtonClick,
            DEFENCE: this.handleDefenceButtonClick,
            ABILITY_1: () => this.handleAbilityClick(AbilitySlot.ABILITY_1),
            ABILITY_2: () => this.handleAbilityClick(AbilitySlot.ABILITY_2),
            ABILITY_3: () => this.handleAbilityClick(AbilitySlot.ABILITY_3),
        };

        return (
            <div className='App'>
                <GlobalHotKeys
                    keyMap={globalKeyMap}
                    handlers={globalHandlers}
                    global
                />
                <div className='arena-container'>
                    <Arena
                        ref={this.arenaRef}

                        gridProps={{
                            cells: cells,
                            cellSize: App.CELL_SIZE,
                            spacing: App.CELL_SPACING,
                        }}

                        path={path}
                        pathTargetPosition={pathTargetPosition}
                        pawns={pawns}

                        onCellClick={this.handleCellClick}
                        onCellMouseMove={this.handleCellMouseMove}
                        onCellMouseEnter={this.handleCellMouseEnter}
                        onCellMouseLeave={this.handleCellMouseLeave}

                        onPawnClick={this.handlePawnClick}
                        onPawnRightClick={this.handlePawnRightClick}
                        onPawnMouseMove={this.handlePawnMouseMove}
                    />
                </div>
                <PawnControls
                    pawnInfo={currentPawnInfo}
                    onAbilityClick={this.handleAbilityClick}
                    onWaitButtonClick={this.handleWaitButtonClick}
                    onDefenceButtonClick={this.handleDefenceButtonClick}
                />
                <PawnInfoModal
                    opened={!!viewedPawnInfo}
                    pawnInfo={viewedPawnInfo}
                    position={new Vector(100, 100)}
                    onClose={() => this.hidePawnInfoModal()}
                />
                <MoveInfoTooltip
                    opened={showMoveInfo}
                    moveInfo={viewedMoveInfo}
                    position={viewedMoveInfoPosition ?? undefined}
                />
                <SplashLayer ref={this.splashLayerRef} />
                <FightSummaryModal
                    opened={!!fightSummary}
                    summary={fightSummary}
                    onClose={() => window.location.reload()}
                />
            </div>
        );
    }
}