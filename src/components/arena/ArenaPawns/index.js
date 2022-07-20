import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import HexagonUtils from '../../../cls/util/HexagonUtils.js';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import ArenaPawn from '../ArenaPawn';
import ArenaGrid from '../ArenaGrid';

export default class ArenaPawns extends React.Component {

    static propTypes = {
        gridProps: PropTypes.shape(ArenaGrid.propTypes),
        pawns: PropTypes.arrayOf(PropTypes.shape(ArenaPawn.propTypes)),
        onPawnClick: PropTypes.func,
        onPawnRightClick: PropTypes.func,
        onPawnMouseMove: PropTypes.func,
    };

    render() {
        let {
            gridProps: {
                cellSize,
                spacing
            },
            pawns,
            onPawnClick,
            onPawnRightClick,
            onPawnMouseMove,
        } = this.props;

        let $pawns = pawns.map(pawn => {
            let position = HexagonUtils.axialToPlainPosition(pawn.axialPosition, cellSize, spacing);

            return (
                <CSSTransition
                    key={pawn.id}
                    timeout={500}
                    classNames='arena-pawn'
                >
                    <ArenaPawn
                        key={pawn.id}
                        {...pawn}
                        axialPosition={pawn.axialPosition}
                        position={position}
                        onClick={onPawnClick}
                        onRightClick={onPawnRightClick}
                        onMouseMove={onPawnMouseMove}
                    />
                </CSSTransition>
            );
        });

        return (
            <TransitionGroup className='arena-pawns'>
                {$pawns}
            </TransitionGroup>
        );
    }
}