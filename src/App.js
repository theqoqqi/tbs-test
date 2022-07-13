import './App.css';
import React from 'react';
import Fight from './cls/Fight.js';
import Arena from './components/Arena/Arena.js';
import GameContext from './cls/context/GameContext.js';
import Vector from './cls/util/Vector.js';
import HexagonUtils from './cls/util/HexagonUtils.js';

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

    handleCellClick(cellProps) {
        let cell = this.arena.getCell(cellProps.position);
        let pawn = this.selectedPawn;

        console.log(cell.toString());

        if (pawn && cellProps.selectable) {
            let move = this.moves.find(move => move.targetCell === cell);

            this.fight.makeMove(move, this.path);

            this.selectedPawn = null;
            this.moves = [];
            this.path = [];
            this.pathTargetPosition = null;
            this.pathDirection = null;
        }
    }

    updatePath(cell, mousePosition) {
        if (!this.selectedPawn) {
            this.path = [];
            this.pathTargetPosition = null;
            this.pathDirection = null;
            return;
        }

        let pawn = this.selectedPawn;
        let neighborCell = this.getSuitableNeighborCell(pawn, cell, mousePosition);
        let cellPlainPosition = HexagonUtils.axialToPlainPosition(cell.position, App.CELL_SIZE, App.CELL_SPACING);
        let angle = cellPlainPosition.angleTo(mousePosition);
        let direction = HexagonUtils.angleToDirection(angle);

        this.path = this.arena.hasPawnAt(cell.position)
            ? this.arena.findPath(pawn.position, neighborCell.position)
            : this.arena.findPath(pawn.position, cell.position);
        this.pathTargetPosition = cell.position;
        this.pathDirection = direction;

        // console.log(this.path)
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
        let isCellFree = !this.arena.hasPawnAt(cell.position);

        return pawnCell === cell || (isCellFree && move && move.actionPoints < move.pawn.speed);
    }

    handleCellMouseMove(cellProps, cellComponent, event) {
        let cell = this.arena.getCell(cellProps.position);
        let move = this.moves.find(move => move.targetCell === cell);
        let mousePosition = this.arenaRef.current.getMousePosition(event);
        let cellPlainPosition = HexagonUtils.axialToPlainPosition(cell.position, App.CELL_SIZE, App.CELL_SPACING);
        let angle = cellPlainPosition.angleTo(mousePosition);
        let direction = HexagonUtils.angleToDirection(angle);

        if (move && this.pathDirection !== direction) {
            this.updatePath(cell, mousePosition);
        }
    }

    handleCellMouseEnter(cellProps) {

    }

    handleCellMouseLeave(cell) {
        this.path = [];
        this.pathTargetPosition = null;
        this.pathDirection = null;
    }

    handlePawnClick(pawnProps) {
        let pawn = this.arena.getPawn(pawnProps.position);

        this.selectedPawn = this.selectedPawn === pawn ? null : pawn;

        if (this.selectedPawn) {
            this.moves = this.arena.getAvailableMoves(this.selectedPawn);
        } else {
            this.moves = [];
        }

        console.log(pawn.toString());
    }

    getCellProps() {
        let selectableCellIds = this.moves.map(move => move.targetCell.id);

        return this.arena.getAllCells().map(arenaCell => {
            return {
                id: arenaCell.id,
                position: arenaCell.position,
                selectable: selectableCellIds.includes(arenaCell.id),
                distance: this.selectedPawn
                    ? this.arena.findPath(this.selectedPawn.position, arenaCell.position).length - 1 // TODO: каждый тик, каждый cell - дохуя
                    : null,
            };
        });
    }

    getPawnProps() {
        return this.arena.getAllPawns().map(arenaPawn => {
            return {
                id: arenaPawn.id,
                position: arenaPawn.position,
                name: arenaPawn.props.name,

                health: arenaPawn.currentHealth,
                maxHealth: arenaPawn.maxHealth,
                damage: arenaPawn.damage,
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
                />
            </div>
        );
    }

    get arena() {
        return this.fight.arena;
    }
}