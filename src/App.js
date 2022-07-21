import './App.css';
import React from 'react';
import Fight from './cls/Fight.js';
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

export default class App extends React.Component {

    static CELL_SIZE = 128;

    static CELL_SPACING = 4;

    constructor(props) {
        super(props);

        let gameContext = new GameContext();

        this.arenaRef = React.createRef();
        this.splashLayerRef = React.createRef();

        this.fight = new Fight(gameContext);
        this.selectedPawn = null;
        this.selectedAbility = null;
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
        };
    }

    componentDidMount() {
        requestAnimationFrame(this.handleAnimationFrame);

        this.fight.start();
        this.setSelectedPawn(this.fight.currentPawn);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }



    // Коллбеки

    handleAnimationFrame = () => {
        this.setState({
            cells: this.getCellProps(),
            pawns: this.getPawnProps(),
            currentPawnInfo: this.selectedPawn
                ? this.collectCurrentPawnInfo(this.selectedPawn)
                : null,
        });

        requestAnimationFrame(this.handleAnimationFrame);
    }

    handleCellClick = (cellComponent) => {
        let cell = this.arena.getCell(cellComponent.props.axialPosition);
        let pawn = this.selectedPawn;

        console.log(cell.toString());

        if (pawn && cellComponent.props.selectable) {
            let move = this.moves.find(move => move.targetCell === cell);

            this.fight.makeMove(move, this.state.path, this.selectedAbility)
                .then(() => this.setSelectedPawn(this.fight.currentPawn));

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

        let pawn = this.arena.getPawn(pawnComponent.props.axialPosition);

        if (this.selectedPawn === pawn) {
            this.clearSelectedPawn();
        } else {
            this.setSelectedPawn(pawn);
        }

        console.log(pawn.toString());
    }

    handlePawnRightClick = (pawnComponent, event) => {
        event.preventDefault();

        let pawn = this.arena.getPawn(pawnComponent.props.axialPosition);

        this.openPawnInfoModalFor(pawn);
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

        if (!this.fight.isAbilityReady(pawn, ability)) {
            return;
        }

        if (this.selectedAbility === ability) {
            this.setSelectedAbility(this.fight.getRegularAbility(pawn));
            return;
        }

        if (ability.targetCollector) {
            this.setSelectedAbility(ability);
        } else {
            this.fight.applyAbility(pawn, ability)
                .then(() => this.setSelectedAbility(this.selectedAbility));
        }
    }

    handleWaitButtonClick = () => {
        if (!this.selectedPawn || this.selectedPawn.isWaiting) {
            return;
        }

        this.fight.makeWaitMove(this.selectedPawn)
            .then(() => this.setSelectedPawn(this.fight.currentPawn));
    }

    handleDefenceButtonClick = () => {
        if (!this.selectedPawn) {
            return;
        }

        this.fight.makeDefenceMove(this.selectedPawn)
            .then(() => this.setSelectedPawn(this.fight.currentPawn));
    }



    // Подсказки и модальные окна

    updateMoveInfoTooltip(event, cell, move) {
        if (!move) {
            this.hideMoveInfoTooltip();
            return;
        }

        let targetPawn = this.arena.getPawn(move.targetCell.position);

        if (!targetPawn) {
            this.hideMoveInfoTooltip();
            return;
        }

        let moveInfo = this.fight.getMoveInfo(move.pawn, targetPawn, this.selectedAbility);

        if (moveInfo) {
            this.showMoveInfoTooltip(moveInfo, cell);
        } else {
            this.hideMoveInfoTooltip();
        }
    }

    openPawnInfoModalFor(pawn) {
        this.setState({
            viewedPawnInfo: this.collectViewedPawnInfo(pawn),
        })
    }

    hidePawnInfoModal() {
        this.setState({
            viewedPawnInfo: null,
        })
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



    // Изменение состояния и полей

    setSelectedPawn(pawn) {
        this.selectedPawn = pawn;

        if (pawn) {
            this.setSelectedAbility(this.fight.getRegularAbility(pawn));
        } else {
            this.clearSelectedAbility();
        }
    }

    setSelectedAbility(ability) {
        this.selectedAbility = ability;
        this.updateAvailableMoves();
    }

    setPath(path, targetPosition) {
        this.pathDirection = this.getDirectionToTarget(path, targetPosition);

        this.setState({
            path: path,
            pathTargetPosition: targetPosition,
        });
    }

    clearSelectedPawn() {
        this.selectedPawn = null;
        this.clearSelectedAbility();
        this.clearPath();
    }

    clearSelectedAbility() {
        this.selectedAbility = null;
        this.moves = [];
    }

    clearPath() {
        this.pathDirection = null;

        this.setState({
            path: [],
            pathTargetPosition: null,
        });
    }



    // Обновление/поиск пути

    tryUpdatePath(event, cell, move) {
        if (!move || move.isRanged) {
            return;
        }

        let mousePosition = this.arenaRef.current.getMousePosition(event);
        let cellPlainPosition = this.axialToPlainPosition(cell.position);
        let angle = cellPlainPosition.angleTo(mousePosition);
        let direction = HexagonUtils.angleToDirection(angle);

        if (this.pathDirection !== direction) {
            this.updatePath(cell, mousePosition);
        }
    }

    updatePath(cell, mousePosition) {
        let pawn = this.selectedPawn;

        if (!pawn) {
            this.clearPath();
            return;
        }

        let neighborCell = this.getSuitableNeighborCell(pawn, cell, mousePosition);

        let path = this.arena.isCellFree(cell.position)
            ? this.arena.findPath(pawn, cell.position)
            : this.arena.findPath(pawn, neighborCell.position);
        let pathTargetPosition = cell.position;

        this.setPath(path, pathTargetPosition);
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

        if (lastPathPosition !== targetPosition) {
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
        let isCellFree = this.arena.isCellFree(cell.position);

        return pawnCell === cell || (isCellFree && move && move.actionPoints < move.pawn.currentSpeed);
    }



    // Сплэши

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
        // TODO: брать текст из локализации
        this.createSplashAtCell(cell, offset, 'Промах!', 'miss');
    }

    createHalfSplash(cell, offset) {
        // TODO: брать текст из локализации
        this.createSplashAtCell(cell, offset, 'Половина!', 'half');
    }

    createSplashAtCell(cell, offset, text, type) {
        let localPosition = this.axialToPlainPosition(cell.position);
        let viewportPosition = this.arenaRef.current.localPositionToViewportPosition(localPosition);
        let position = viewportPosition.add(offset);

        this.splashLayerRef.current.createSplash(position, text, type);
    }



    // Прочее

    axialToPlainPosition(axialPosition) {
        return HexagonUtils.axialToPlainPosition(axialPosition, App.CELL_SIZE, App.CELL_SPACING);
    }

    updateAvailableMoves() {
        this.moves = this.fight.getAvailableMoves(this.selectedPawn, this.selectedAbility);
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
                distance: selectedPawn && cell.passability === PassabilityType.WALKING_PASSABLE
                    ? this.arena.findPath(selectedPawn, cell.position).length - 1 // TODO: каждый тик, каждый cell - дохуя
                    : null,
                content: passabilityContentMap[cell.passability] ?? null,
            };
        });
    }

    getPawnProps() {
        return this.arena.getAllPawns().map(pawn => {
            return {
                id: pawn.id,
                axialPosition: pawn.position,
                name: pawn.props.name,
                teamColor: pawn.team.hexColor,

                stackSize: pawn.stackSize,
                health: pawn.currentHealth,
                maxHealth: pawn.maxHealth,
            };
        });
    }

    collectViewedPawnInfo(pawn) {
        let regularAbility = this.fight.getRegularAbility(pawn);

        return {
            attack: pawn.attack,
            defence: pawn.defence,
            initiative: pawn.initiative,
            currentSpeed: pawn.currentSpeed,
            maxSpeed: pawn.maxSpeed,
            criticalHitChance: pawn.criticalHitChance,
            currentHealth: pawn.currentHealth,
            maxHealth: pawn.maxHealth,
            resistances: pawn.resistances,
            damageRanges: regularAbility.damageRanges,
            movementType: pawn.movementType,

            baseAttack: pawn.baseAttack,
            baseDefence: pawn.baseDefence,
            baseInitiative: pawn.baseInitiative,
            baseMaxSpeed: pawn.baseMaxSpeed,
            baseCriticalHitChance: pawn.baseCriticalHitChance,
            baseMaxHealth: pawn.baseMaxHealth,
        };
    }

    collectCurrentPawnInfo(pawn) {
        let slots = [AbilitySlot.ABILITY_1, AbilitySlot.ABILITY_2, AbilitySlot.ABILITY_3];
        let abilities = this.fight.getReadyAbilities(pawn, slots)
            .map(ability => {
                return {
                    slot: ability.slot,
                    title: ability.hintTitle,
                    description: ability.hintDescription,
                    currentReload: ability.currentReload,
                    maxReload: ability.reload,
                    usesCharges: ability.usesCharges,
                    charges: ability.currentCharges,
                    muted: this.fight.isAbilityMuted(pawn, ability),
                    ready: this.fight.isAbilityReady(pawn, ability),
                    selected: this.selectedAbility === ability,
                };
            });

        return {
            abilities,
            canWait: !pawn.isWaiting,
            currentSpeed: pawn.currentSpeed,
            maxSpeed: pawn.maxSpeed,
        };
    }

    get arena() {
        return this.fight.arena;
    }



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
        } = this.state;

        return (
            <div className='App'>
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
            </div>
        );
    }
}