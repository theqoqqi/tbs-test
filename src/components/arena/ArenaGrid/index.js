import styles from './index.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import ArenaCell from '../ArenaCell';
import HexagonUtils from '../../../cls/util/HexagonUtils.js';

export default class ArenaGrid extends React.Component {

    static propTypes = {
        cells: PropTypes.arrayOf(PropTypes.shape(ArenaCell.propTypes)),
        cellSize: PropTypes.number.isRequired,
        spacing: PropTypes.number.isRequired,
        onClick: PropTypes.func,
        onMouseMove: PropTypes.func,
        onCellMouseEnter: PropTypes.func,
        onCellMouseLeave: PropTypes.func,
    };

    static defaultProps = {
        cells: [],
    };

    constructor(props) {
        super(props);

        this.cellRefs = new Map();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        this.cellRefs.clear();

        for (let cell of nextProps.cells) {
            let cellRef = React.createRef();

            this.cellRefs.set(cell.id, cellRef);
        }

        return true;
    }

    render() {
        let $cells = this.props.cells.map(cell => {
            let position = this.coordsToPosition(cell.axialPosition);
            let cellRef = this.cellRefs.get(cell.id);

            return (
                <ArenaCell
                    {...cell}
                    ref={cellRef}
                    axialPosition={cell.axialPosition}
                    position={position}
                    key={cell.id}
                    onClick={this.props.onClick}
                    onMouseMove={this.props.onMouseMove}
                    onMouseEnter={this.props.onCellMouseEnter}
                    onMouseLeave={this.props.onCellMouseLeave}
                />
            );
        });

        return (
            <div className={styles.arenaGrid}>
                {$cells}
            </div>
        );
    }

    getCell(position) {
        let cellRefs = Array.from(this.cellRefs.values());
        let cellRef = cellRefs.find(cellRef => {
            return cellRef.current.props.axialPosition.equals(position);
        });

        return cellRef?.current;
    }

    coordsToPosition(position) {
        return HexagonUtils.axialToPlainPosition(position, this.props.cellSize, this.props.spacing);
    }
}
