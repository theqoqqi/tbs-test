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
        this.moves = [];

        this.state = {
            //
        };

        this.handleCellClick = this.handleCellClick.bind(this);
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

    handleCellClick(cell) {
        let cellModel = this.fight.arena.getCell(cell.position);

        console.log(cellModel.toString());

        if (this.selectedPawn && cell.selectable) {
            if (this.fight.arena.hasPawnAt(cell.position)) {
                let attackedPawn = this.fight.arena.getPawn(cell.position);

                console.log('Attacked', attackedPawn.toString(), 'by', this.selectedPawn.toString());
            } else {
                this.selectedPawn.position = cell.position;

                console.log('Moved', this.selectedPawn.toString(), 'to', cellModel.toString());
            }

            // this.forceUpdate();

            this.selectedPawn = null;
            this.path = null;
            this.moves = [];
        }
    }

    handleCellMouseEnter(cell) {
        let cellModel = this.fight.arena.getCell(cell.position);

        if (this.selectedPawn && this.moves.includes(cellModel)) {
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
            this.moves = this.fight.arena.getAvailableMoves(this.selectedPawn);
        } else {
            this.moves = [];
        }

        console.log(arenaPawn.toString());
    }

    getCellProps() {
        let selectableCellIds = this.moves.map(move => move.targetCell.id);

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
                    onPawnClick={this.handlePawnClick}
                />
            </div>
        );
    }
}