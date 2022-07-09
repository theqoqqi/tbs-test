import './ArenaPath.css';
import React from 'react';
import eachCons from 'each-cons';
import Vector from '../../cls/util/Vector.js';
import HexagonUtils from '../../cls/util/HexagonUtils.js';
import PropTypes from 'prop-types';

export default class ArenaPath extends React.Component {

    static LINE_WIDTH = 12;

    static propTypes = {
        path: PropTypes.arrayOf(PropTypes.instanceOf(Vector)),
    };

    getPathNodes() {
        // TODO: Вынести cellSize/spacing в props (или использовать context компонента Arena)
        let plainPositions = this.props.path.map(p => {
            return HexagonUtils.axialToPlainPosition(p, 128, 4);
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
                    // this.testNode(from, index++),
                    // this.testNode(center, index++),
                    // this.testNode(to, index++),
                ];
            });
    }

    testNode(position, index) {
        return <div key={index++} style={{
            position: 'absolute',
            left: position.x + 'px',
            top: position.y + 'px',
            width: ArenaPath.LINE_WIDTH / 2 + 'px',
            height: ArenaPath.LINE_WIDTH / 2 + 'px',
            backgroundColor: 'black',
            border: '2px solid black',
            borderRadius: '222px',
            transform: `translate(-${ArenaPath.LINE_WIDTH / 4}px, -${ArenaPath.LINE_WIDTH / 4}px)`,
            // zIndex: 3333,
            boxSizing: 'border-box',
        }} />;
    }

    createNode(from, to, index) {
        let difference = Vector.subtract(from, to);
        let distance = difference.length() + ArenaPath.LINE_WIDTH;
        let center = from.add(difference.multiply(-0.5));
        let angle = Vector.angleBetween(from, to);

        return (
            <div
                key={index}
                className='arena-path-node'
                style={{
                    left: center.x + 'px',
                    top: center.y + 'px',
                    width: distance + 'px',
                    height: ArenaPath.LINE_WIDTH + 'px',
                    transform: `translate(${-difference.x / 2 - ArenaPath.LINE_WIDTH / 2}px, ${-difference.y / 2 - ArenaPath.LINE_WIDTH / 2}px) rotate(${angle}deg)`,
                    transformOrigin: `${ArenaPath.LINE_WIDTH / 2}px ${ArenaPath.LINE_WIDTH / 2}px`,
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