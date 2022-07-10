import './ArenaPath.css';
import React from 'react';
import eachCons from 'each-cons';
import Vector from '../../cls/util/Vector.js';
import HexagonUtils from '../../cls/util/HexagonUtils.js';
import PropTypes from 'prop-types';
import ArenaContext from '../Arena/ArenaContext.js';

export default class ArenaPath extends React.Component {

    static LINE_WIDTH = 12;

    static contextType = ArenaContext;

    static propTypes = {
        path: PropTypes.arrayOf(PropTypes.instanceOf(Vector)),
    };

    getPathNodes() {
        let plainPositions = this.props.path.map(p => {
            let {cellSize, spacing} = this.context.gridProps;

            return HexagonUtils.axialToPlainPosition(p, cellSize, spacing);
        });

        let index = 0;

        return eachCons(plainPositions.reverse(), 2)
            .flatMap(positions => {
                let from = positions[0];
                let to = positions[1];
                let difference = Vector.subtract(from, to);
                let center = from.add(difference.multiply(-0.5));

                return [
                    this.createNode(from, center, index++),
                    this.createNode(center, to, index++),
                ];
            });
    }

    createNode(from, to, index) {
        let difference = Vector.subtract(from, to);
        let distance = difference.length() + ArenaPath.LINE_WIDTH;
        let center = Vector.lerp(from, to, 0.5);
        let angle = Vector.angleBetween(from, to);
        let halfLineWidth = ArenaPath.LINE_WIDTH / 2;
        let translateBy = difference.multiply(-0.5).subtract(halfLineWidth);

        return (
            <div
                key={index}
                className='arena-path-node'
                style={{
                    left: center.x + 'px',
                    top: center.y + 'px',
                    width: distance + 'px',
                    height: ArenaPath.LINE_WIDTH + 'px',
                    transform: `translate(${translateBy.x}px, ${translateBy.y}px) rotate(${angle}deg)`,
                    transformOrigin: `${halfLineWidth}px ${halfLineWidth}px`,
                    // filter: `hue-rotate(${index * 90}deg)`,
                }}
            />
        );
    }

    render() {
        let $pathNodes = this.getPathNodes();

        return (
            <div className='arena-path'>
                {$pathNodes}
            </div>
        );
    }
}