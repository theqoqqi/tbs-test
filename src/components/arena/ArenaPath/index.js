import styles from './index.module.css';
import React from 'react';
import eachCons from 'each-cons';
import Vector from '../../../cls/util/Vector.js';
import HexagonUtils from '../../../cls/util/HexagonUtils.js';
import PropTypes from 'prop-types';
import ArenaContext from '../Arena/ArenaContext.js';
import classNames from 'classnames';

export default class ArenaPath extends React.Component {

    static LINE_WIDTH = 12;

    static contextType = ArenaContext;

    static propTypes = {
        path: PropTypes.arrayOf(PropTypes.instanceOf(Vector)),
        targetPosition: PropTypes.instanceOf(Vector),
    };

    getPathNodes() {
        let {cellSize, spacing} = this.context.gridProps;
        let plainPositions = this.props.path.map(p => {
            return HexagonUtils.axialToPlainPosition(p, cellSize, spacing);
        });
        let lastPlainPosition = plainPositions[plainPositions.length - 1];
        let targetPlainPosition = HexagonUtils.axialToPlainPosition(this.props.targetPosition, cellSize, spacing);

        let index = 0;
        let pathNodes = [];

        if (!targetPlainPosition.equals(lastPlainPosition)) {
            let center = Vector.lerp(lastPlainPosition, targetPlainPosition, 0.5);
            let node = this.createNode(styles.arenaPathNodeAttack, center, lastPlainPosition, index++);

            pathNodes.unshift(node);
        }

        let moveNodes = eachCons(plainPositions.reverse(), 2)
            .flatMap(positions => {
                let from = positions[0];
                let to = positions[1];
                let difference = Vector.subtract(from, to);
                let center = from.add(difference.multiply(-0.5));

                return [
                    this.createNode(styles.arenaPathNodeMove, from, center, index++),
                    this.createNode(styles.arenaPathNodeMove, center, to, index++),
                ];
            });

        pathNodes.push(...moveNodes);

        return pathNodes;
    }

    createNode(className, from, to, index) {
        let difference = Vector.subtract(from, to);
        let distance = difference.length() + ArenaPath.LINE_WIDTH;
        let center = Vector.lerp(from, to, 0.5);
        let angle = Vector.angleBetween(from, to);
        let halfLineWidth = ArenaPath.LINE_WIDTH / 2;
        let translateBy = difference.multiply(-0.5).subtract(halfLineWidth);

        return (
            <div
                key={index}
                className={classNames(styles.arenaPathNode, className)}
                style={{
                    left: center.x + 'px',
                    top: center.y + 'px',
                    width: distance + 'px',
                    height: ArenaPath.LINE_WIDTH + 'px',
                    transform: `translate(${translateBy.x}px, ${translateBy.y}px) rotate(${angle}deg)`,
                    transformOrigin: `${halfLineWidth}px ${halfLineWidth}px`,
                }}
            />
        );
    }

    render() {
        let $pathNodes = this.getPathNodes();

        return (
            <div className={styles.arenaPath}>
                {$pathNodes}
            </div>
        );
    }
}