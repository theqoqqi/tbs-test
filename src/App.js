import './App.css';
import React from 'react';
import Fight from './cls/Fight.js';
import Arena from './components/arena/Arena/Arena.js';
import GameContext from './cls/context/GameContext.js';
import HexagonUtils from './cls/util/HexagonUtils.js';
import PawnInfoModal from './components/ui/PawnInfoModal/PawnInfoModal.js';
import Vector from './cls/util/Vector.js';
import PassabilityType from './cls/enums/PassabilityType.js';
import MoveInfoTooltip from './components/ui/MoveInfoTooltip/MoveInfoTooltip.js';

export default class App extends React.Component {

    static CELL_SIZE = 128;

    static CELL_SPACING = 4;

    constructor(props) {
        super(props);

        let gameContext = new GameContext();

        this.arenaRef = React.createRef();

        this.fight = new Fight(gameContext);
        this.selectedPawn = null;
        this.activeAbility = null;
        this.moves = [];
        this.pathDirection = null;

        this.state = {
            cells: [],
            pawns: [],

            path: [],
            pathTargetPosition: null,

            viewedPawnInfo: null,

            showMoveInfo: false,
            viewedMoveInfo: null,
            viewedMoveInfoPosition: null,
        };

        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleCellMouseMove = this.handleCellMouseMove.bind(this);
        this.handleCellMouseEnter = this.handleCellMouseEnter.bind(this);
        this.handleCellMouseLeave = this.handleCellMouseLeave.bind(this);
        this.handlePawnClick = this.handlePawnClick.bind(this);
        this.handlePawnRightClick = this.handlePawnRightClick.bind(this);
        this.handlePawnMouseMove = this.handlePawnMouseMove.bind(this);
        this.handleAnimationFrame = this.handleAnimationFrame.bind(this);
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

    handleAnimationFrame() {
        this.setState({
            cells: this.getCellProps(),
            pawns: this.getPawnProps(),
        });

        requestAnimationFrame(this.handleAnimationFrame);
    }

    handleCellClick(cellComponent) {
        let cell = this.arena.getCell(cellComponent.props.axialPosition);
        let pawn = this.selectedPawn;

        console.log(cell.toString());

        if (pawn && cellComponent.props.selectable) {
            let move = this.moves.find(move => move.targetCell === cell);

            this.fight.makeMove(move, this.state.path, this.activeAbility)
                .then(() => {
                    if (pawn.currentSpeed > 0) {
                        this.setSelectedPawn(pawn);
                    } else {
                        this.fight.nextTurn();
                        this.setSelectedPawn(this.fight.currentPawn);
                    }
                });

            this.clearSelectedPawn();
        }
    }

    handleCellMouseMove(cellComponent, event) {
        let cell = this.arena.getCell(cellComponent.props.axialPosition);

        this.handleMouseMove(cell, event);
    }

    handleCellMouseEnter(cellComponent) {

    }

    handleCellMouseLeave(cellComponent) {
        this.clearPath();
    }

    handlePawnClick(pawnComponent, event) {
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

    handlePawnRightClick(pawnComponent, event) {
        event.preventDefault();

        let pawn = this.arena.getPawn(pawnComponent.props.axialPosition);

        this.openPawnInfoModalFor(pawn);
    }

    handlePawnMouseMove(pawnComponent, event) {
        let cell = this.arena.getCell(pawnComponent.props.axialPosition);

        this.handleMouseMove(cell, event);
    }

    handleMouseMove(cell, event) {
        let move = this.moves.find(move => move.targetCell === cell);

        this.tryUpdatePath(event, cell, move);
        this.updateMoveInfoTooltip(event, cell, move);
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

        let moveInfo = this.fight.getMoveInfo(move.pawn, targetPawn, this.activeAbility);

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
        let position = HexagonUtils.axialToPlainPosition(targetCell.position, App.CELL_SIZE, App.CELL_SPACING);
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
        this.setActiveAbility(this.fight.getRegularAbility(pawn));
    }

    setActiveAbility(ability) {
        this.activeAbility = ability;
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
        this.clearActiveAbility();
        this.clearPath();
    }

    clearActiveAbility() {
        this.activeAbility = null;
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
        let cellPlainPosition = HexagonUtils.axialToPlainPosition(cell.position, App.CELL_SIZE, App.CELL_SPACING);
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
        let cellPlainPosition = HexagonUtils.axialToPlainPosition(originCell.position, App.CELL_SIZE, App.CELL_SPACING);
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

        return pawnCell === cell || (isCellFree && move && move.actionPoints < move.pawn.speed);
    }



    // Прочее

    updateAvailableMoves() {
        this.moves = this.fight.getAvailableMoves(this.selectedPawn, this.activeAbility);
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
            speed: pawn.speed,
            criticalHitChance: pawn.criticalHitChance,
            currentHealth: pawn.currentHealth,
            maxHealth: pawn.maxHealth,
            resistances: pawn.resistances,
            damageRanges: regularAbility.damageRanges,
            movementType: pawn.movementType,

            baseAttack: pawn.baseAttack,
            baseDefence: pawn.baseDefence,
            baseInitiative: pawn.baseInitiative,
            baseSpeed: pawn.baseSpeed,
            baseCriticalHitChance: pawn.baseCriticalHitChance,
            baseMaxHealth: pawn.baseMaxHealth,
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
            </div>
        );
    }
}