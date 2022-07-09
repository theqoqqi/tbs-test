import './App.css';
import React from 'react';
import Fight from './cls/Fight.js';
import Arena from './components/Arena/Arena.js';
import GameContext from './cls/context/GameContext.js';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        let gameContext = new GameContext();

        this.fight = new Fight(gameContext);
        this.selectedPawn = null;
        this.path = [];
        this.passables = [];

        this.state = {
            //
        };

        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleCellMouseEnter = this.handleCellMouseEnter.bind(this);
        this.handleCellMouseLeave = this.handleCellMouseLeave.bind(this);
        this.handlePawnClick = this.handlePawnClick.bind(this);
        this.handleAnimationFrame = this.handleAnimationFrame.bind(this);

        requestAnimationFrame(this.handleAnimationFrame);
    }

    handleAnimationFrame() {
        this.forceUpdate(() => {
            requestAnimationFrame(this.handleAnimationFrame);
        });
    }

    handleCellClick(cell) {
        let cellModel = this.fight.arena.getCell(cell.position);

        console.log(cellModel.toString());

        if (this.selectedPawn && cell.selectable) {
            this.selectedPawn.position = cell.position;

            console.log('Moved', this.selectedPawn.toString(), 'to', cellModel.toString());

            // this.forceUpdate();

            this.selectedPawn = null;
            this.path = null;
            this.passables = [];
        }
    }

    handleCellMouseEnter(cell) {
        let cellModel = this.fight.arena.getCell(cell.position);

        if (this.selectedPawn && this.passables.includes(cellModel)) {
            this.path = this.fight.arena.findPath(this.selectedPawn.position, cell.position);
        }
    }

    handleCellMouseLeave(cell) {
        this.path = null;
    }

    handlePawnClick(pawn) {
        let arenaPawn = this.fight.arena.getPawn(pawn.position);

        this.selectedPawn = this.selectedPawn === arenaPawn ? null : arenaPawn;

        if (this.selectedPawn) {
            this.passables = this.fight.arena.getPassableCells(this.selectedPawn.position, this.selectedPawn.props.speed);
        }

        console.log(arenaPawn.toString());
    }

    getCellProps() {
        let selectableCells = this.selectedPawn ? this.passables : [];
        let selectableCellIds = selectableCells.map(cell => cell.id);

        return this.fight.arena.getAllCells().map(arenaCell => {
            return {
                id: arenaCell.id,
                position: arenaCell.position,
                selectable: selectableCellIds.includes(arenaCell.id),
                distance: this.selectedPawn
                    ? this.fight.arena.findPath(this.selectedPawn.position, arenaCell.position).length - 1
                    : null,
            };
        });
    }

    getPawnProps() {
        return this.fight.arena.getAllPawns().map(arenaPawn => {
            return {
                id: arenaPawn.id,
                position: arenaPawn.position,
                pawnProps: arenaPawn.props,
                name: arenaPawn.props.name,
            };
        });
    }

    render() {
        let cells = this.getCellProps();
        let pawns = this.getPawnProps();
        let path = this.selectedPawn ? this.path : [];

        return (
            <div className='App'>
                <Arena
                    gridProps={{
                        cells: cells,
                        cellSize: 128,
                        spacing: 4,
                    }}
                    path={path}
                    pawns={pawns}
                    onCellClick={this.handleCellClick}
                    onCellMouseEnter={this.handleCellMouseEnter}
                    onCellMouseLeave={this.handleCellMouseLeave}
                    on={this.handleCellClick}
                    onPawnClick={this.handlePawnClick}
                />
            </div>
        );
    }
}