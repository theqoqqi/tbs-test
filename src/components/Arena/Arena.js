import './Arena.css';
import React from 'react';
import PropTypes from 'prop-types';
import ArenaGrid from '../ArenaGrid/ArenaGrid.js';
import ArenaPawn from '../ArenaPawn/ArenaPawn.js';
import HexagonUtils from '../../cls/util/HexagonUtils.js';
import Vector from '../../cls/util/Vector.js';
import ArenaPath from '../ArenaPath/ArenaPath.js';
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
    };

    static defaultProps = {
        gridProps: ArenaGrid.defaultProps,
        pawns: [],
        path: [],
    };

    constructor(props) {
        super(props);

        this.root = React.createRef();
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
            onPawnClick,
            onCellClick,
            onCellMouseMove,
            onCellMouseEnter,
            onCellMouseLeave,
        } = this.props;

        let $pawns = pawns.map(pawn => {
            let position = HexagonUtils.axialToPlainPosition(pawn.position, cellSize, spacing);

            pawn.onClick = () => onPawnClick(pawn);

            return <ArenaPawn key={pawn.id} {...pawn} position={position} />;
        });

        let shouldDrawPath = path?.length > 0 || pathTargetPosition !== null;

        return (
            <ArenaContext.Provider value={this.props}>
                <div className='arena' ref={this.root}>
                    <ArenaGrid
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

    getMousePosition(event) {
        let offset = this.root.current.getBoundingClientRect();
        let x = event.pageX - offset.left;
        let y = event.pageY - offset.top;

        return new Vector(x, y);
    }
}