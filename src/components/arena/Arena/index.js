import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import ArenaGrid from '../ArenaGrid';
import ArenaPawn from '../ArenaPawn';
import HexagonUtils from '../../../cls/util/HexagonUtils.js';
import Vector from '../../../cls/util/Vector.js';
import ArenaPath from '../ArenaPath';
import ArenaContext from './ArenaContext.js';

export default class Arena extends React.Component {

    static propTypes = {
        gridProps: PropTypes.shape(ArenaGrid.propTypes),
        pawns: PropTypes.arrayOf(PropTypes.shape(ArenaPawn.propTypes)),
        path: PropTypes.arrayOf(PropTypes.instanceOf(Vector)),
        pathTargetPosition: PropTypes.instanceOf(Vector),
        onCellClick: PropTypes.func,
        onCellMouseMove: PropTypes.func,
        onCellMouseEnter: PropTypes.func,
        onCellMouseLeave: PropTypes.func,
        onPawnClick: PropTypes.func,
        onPawnRightClick: PropTypes.func,
        onPawnMouseMove: PropTypes.func,
    };

    static defaultProps = {
        gridProps: ArenaGrid.defaultProps,
        pawns: [],
        path: [],
    };

    constructor(props) {
        super(props);

        this.rootRef = React.createRef();
        this.gridRef = React.createRef();
    }

    render() {
        let {
            gridProps: {
                cellSize,
                spacing
            },
            gridProps,
            pawns,
            path,
            pathTargetPosition,
            onCellClick,
            onCellMouseMove,
            onCellMouseEnter,
            onCellMouseLeave,
            onPawnClick,
            onPawnRightClick,
            onPawnMouseMove,
        } = this.props;

        let $pawns = pawns.map(pawn => {
            let position = HexagonUtils.axialToPlainPosition(pawn.axialPosition, cellSize, spacing);

            return (
                <ArenaPawn
                    key={pawn.id}
                    {...pawn}
                    axialPosition={pawn.axialPosition}
                    position={position}
                    onClick={onPawnClick}
                    onRightClick={onPawnRightClick}
                    onMouseMove={onPawnMouseMove}
                />
            );
        });

        let shouldDrawPath = path?.length > 0 || pathTargetPosition !== null;

        return (
            <ArenaContext.Provider value={this.props}>
                <div className='arena' ref={this.rootRef}>
                    <ArenaGrid
                        ref={this.gridRef}
                        onClick={onCellClick}
                        onMouseMove={onCellMouseMove}
                        onCellMouseEnter={onCellMouseEnter}
                        onCellMouseLeave={onCellMouseLeave}
                        {...gridProps}
                    />
                    {shouldDrawPath && <ArenaPath path={path} targetPosition={pathTargetPosition} />}
                    {$pawns}
                </div>
            </ArenaContext.Provider>
        );
    }

    getCell(position) {
        return this.gridRef.current.getCell(position);
    }

    getMousePosition(event) {
        let mousePosition = new Vector(event.pageX, event.pageY);

        return this.viewportPositionToLocalPosition(mousePosition);
    }

    viewportPositionToLocalPosition(localPosition) {
        let offset = this.rootRef.current.getBoundingClientRect();
        let x = localPosition.x - offset.left;
        let y = localPosition.y - offset.top;

        return new Vector(x, y);
    }

    localPositionToViewportPosition(viewportPosition) {
        let offset = this.rootRef.current.getBoundingClientRect();
        let x = viewportPosition.x + offset.left;
        let y = viewportPosition.y + offset.top;

        return new Vector(x, y);
    }
}