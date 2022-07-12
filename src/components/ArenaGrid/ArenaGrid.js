import './ArenaGrid.css';
import React from 'react';
import PropTypes from 'prop-types';
import ArenaCell from '../ArenaCell/ArenaCell.js';
import HexagonUtils from '../../cls/util/HexagonUtils.js';

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

    render() {
        let $cells = this.props.cells.map(cell => {
            let position = this.coordsToPosition(cell.position);

            return (
                <ArenaCell
                    {...cell}
                    position={position}
                    coords={cell.position.x + ' ' + cell.position.y}
                    key={cell.id}
                    onClick={(boardCell, e) => this.props.onClick?.(cell, boardCell, e)}
                    onMouseMove={(boardCell, e) => this.props.onMouseMove?.(cell, boardCell, e)}
                    onMouseEnter={(boardCell, e) => this.props.onCellMouseEnter?.(cell, boardCell, e)}
                    onMouseLeave={(boardCell, e) => this.props.onCellMouseLeave?.(cell, boardCell, e)}
                />
            );
        });

        return (
            <div className='arena-grid'>
                {$cells}
            </div>
        );
    }

    coordsToPosition(position) {
        return HexagonUtils.axialToPlainPosition(position, this.props.cellSize, this.props.spacing);
    }
}
