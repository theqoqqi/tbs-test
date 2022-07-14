import './App.css';
import React from 'react';
import Fight from './cls/Fight.js';
import Arena from './components/Arena/Arena.js';
import GameContext from './cls/context/GameContext.js';
import HexagonUtils from './cls/util/HexagonUtils.js';
import PassabilityTypes from './cls/arena/PassabilityTypes.js';

export default class App extends React.Component {

    static CELL_SIZE = 128;

    static CELL_SPACING = 4;

    constructor(props) {
        super(props);

        let gameContext = new GameContext();

        this.arenaRef = React.createRef();

        this.fight = new Fight(gameContext);
        this.selectedPawn = null;
        this.moves = [];
        this.path = [];
        this.pathTargetPosition = null;
        this.pathDirection = null;

        this.state = {
            //
        };

        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleCellMouseMove = this.handleCellMouseMove.bind(this);
        this.handleCellMouseEnter = this.handleCellMouseEnter.bind(this);
        this.handleCellMouseLeave = this.handleCellMouseLeave.bind(this);
        this.handlePawnClick = this.handlePawnClick.bind(this);
        this.handlePawnMouseMove = this.handlePawnMouseMove.bind(this);
        this.handleAnimationFrame = this.handleAnimationFrame.bind(this);
    }

    componentDidMount() {
        requestAnimationFrame(this.handleAnimationFrame);
    }

    handleAnimationFrame() {
        this.forceUpdate(() => {
            requestAnimationFrame(this.handleAnimationFrame);
        });
    }

    handleCellClick(cellComponent) {
        let cell = this.arena.getCell(cellComponent.props.axialPosition);

        console.log(cell.toString());

        if (this.selectedPawn && cellComponent.props.selectable) {
            let move = this.moves.find(move => move.targetCell === cell);

            this.fight.makeMove(move, this.path);

            this.clearSelectedPawn();
            this.clearPath();
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

    handlePawnMouseMove(pawnComponent, event) {
        let cell = this.arena.getCell(pawnComponent.props.axialPosition);

        this.handleMouseMove(cell, event);
    }

    handleMouseMove(cell, event) {
        let move = this.moves.find(move => move.targetCell === cell);
        let mousePosition = this.arenaRef.current.getMousePosition(event);
        let cellPlainPosition = HexagonUtils.axialToPlainPosition(cell.position, App.CELL_SIZE, App.CELL_SPACING);
        let angle = cellPlainPosition.angleTo(mousePosition);
        let direction = HexagonUtils.angleToDirection(angle);

        if (move && this.pathDirection !== direction) {
            this.updatePath(cell, mousePosition);
        }
    }

    setSelectedPawn(pawn) {
        this.selectedPawn = pawn;
        this.moves = [];

        if (pawn) {
            this.moves = this.arena.getAvailableMoves(pawn);
        }
    }

    setPath(path, targetPosition) {
        this.path = path;
        this.pathTargetPosition = targetPosition;
        this.pathDirection = this.getDirectionToTarget(path, targetPosition);
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

    clearSelectedPawn() {
        this.selectedPawn = null;
        this.moves = [];
    }

    clearPath() {
        this.path = [];
        this.pathTargetPosition = null;
        this.pathDirection = null;
    }

    updatePath(cell, mousePosition) {
        if (!this.selectedPawn) {
            this.clearPath();
            return;
        }

        let pawn = this.selectedPawn;
        let neighborCell = this.getSuitableNeighborCell(pawn, cell, mousePosition);

        let path = this.arena.isCellFree(cell.position)
            ? this.arena.findPath(pawn, cell.position)
            : this.arena.findPath(pawn, neighborCell.position);
        let pathTargetPosition = cell.position;

        this.setPath(path, pathTargetPosition);
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

    getCellProps() {
        let selectableCellIds = this.moves.map(move => move.targetCell.id);
        let passabilityContentMap = {
            [PassabilityTypes.SOARING_PASSABLE]: <span style={{fontSize: '40px'}}>S</span>,
            [PassabilityTypes.FLYING_PASSABLE]: <span style={{fontSize: '40px'}}>F</span>,
            [PassabilityTypes.IMPASSABLE]: <span style={{fontSize: '40px'}}>I</span>,
        };

        return this.arena.getAllCells().map(cell => {
            return {
                id: cell.id,
                axialPosition: cell.position,
                selectable: selectableCellIds.includes(cell.id),
                passability: cell.passability,
                distance: this.selectedPawn && cell.passability === PassabilityTypes.WALKING_PASSABLE
                    ? this.arena.findPath(this.selectedPawn, cell.position).length - 1 // TODO: каждый тик, каждый cell - дохуя
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

                count: pawn.count,
                health: pawn.currentHealth,
                maxHealth: pawn.maxHealth,
                damage: pawn.damage,
            };
        });
    }

    render() {
        let cells = this.getCellProps();
        let pawns = this.getPawnProps();
        let path = this.selectedPawn ? this.path : [];
        let pathTargetPosition = this.pathTargetPosition;

        return (
            <div className='App'>
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
                    onPawnMouseMove={this.handlePawnMouseMove}
                />
            </div>
        );
    }

    get arena() {
        return this.fight.arena;
    }
}