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
        onCellClick: PropTypes.func,
        onCellMouseEnter: PropTypes.func,
        onCellMouseLeave: PropTypes.func,
        onPawnClick: PropTypes.func,
    };

    static defaultProps = {
        gridProps: ArenaGrid.defaultProps,
        pawns: [],
        path: [],
    };

    render() {
        let {
            gridProps: {
                cellSize,
                spacing
            },
            gridProps,
            pawns,
            path,
            onPawnClick,
            onCellClick,
            onCellMouseEnter,
            onCellMouseLeave,
        } = this.props;

        let $pawns = pawns.map(pawn => {
            let position = HexagonUtils.axialToPlainPosition(pawn.position, cellSize, spacing);

            pawn.onClick = () => onPawnClick(pawn);

            return <ArenaPawn key={pawn.id} {...pawn} position={position} />;
        });

        // console.log(path)
        return (
            <ArenaContext.Provider value={this.props}>
                <div className='arena'>
                    <ArenaGrid
                        onClick={onCellClick}
                        onCellMouseEnter={onCellMouseEnter}
                        onCellMouseLeave={onCellMouseLeave}
                        {...gridProps}
                    />
                    {path?.length > 0 && <ArenaPath path={path} />}
                    {$pawns}
                </div>
            </ArenaContext.Provider>
        );
    }
}