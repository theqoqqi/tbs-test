import './ArenaPath.css';
import React from 'react';
import eachCons from 'each-cons';
import Vector from '../../cls/util/Vector.js';
import HexagonUtils from '../../cls/util/HexagonUtils.js';
import PropTypes from 'prop-types';

export default class ArenaPath extends React.Component {

    static propTypes = {
        path: PropTypes.arrayOf(PropTypes.instanceOf(Vector)),
    };

    getPathNodes() {
        // TODO: Вынести cellSize/spacing в props (или использовать context компонента Arena)
        let plainPositions = this.props.path.map(p => {
            return HexagonUtils.axialToPlainPosition(p, 128, 4);
        });

        return eachCons(plainPositions, 2)
            .map((positions, index) => this.createNode(positions[0], positions[1], index));
    }

    createNode(from, to, index) {
        let difference = Vector.subtract(from, to);
        let distance = difference.length();
        let center = from.add(difference.multiply(-0.5));
        let angle = Vector.angleBetween(from, to);

        console.log('angle', from, to, angle)

        return (
            <div
                key={index}
                className='arena-path-node'
                style={{
                    left: -66 + center.x + 'px',
                    top: center.y + 'px',
                    width: distance + 'px',
                    transform: `rotate(${angle}deg)`,
                }}
            />
        );
    }

    render() {
        let $pathNodes = this.getPathNodes();

        return (
            <div className='arena-path' style={{
                width: '4px',
                height: '4px',
                background: 'red',
            }}>
                {$pathNodes}
            </div>
        );
    }
}