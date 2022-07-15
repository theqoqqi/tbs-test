import './PawnInfoModal.css';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal.js';
import MovementTypes from '../../../cls/arena/MovementTypes.js';

class PawnParameter extends React.Component {

    render() {
        return (
            <div className='pawn-parameter'>
                <div className='pawn-parameter-title'>
                    {this.props.title}
                </div>
                <div className='pawn-parameter-value'>
                    {this.props.value}
                </div>
            </div>
        );
    }
}

export default class PawnInfoModal extends React.Component {

    static propTypes = {
        pawnInfo: PropTypes.shape({
            currentHealth: PropTypes.number,
            maxHealth: PropTypes.number,
            speed: PropTypes.number,
            minDamage: PropTypes.number,
            maxDamage: PropTypes.number,
            movementType: PropTypes.oneOf(Object.values(MovementTypes)),
        }),
    };

    constructor(props) {
        super(props);
    }

    render() {
        let {
            pawnInfo: p,
            opened,
            position,
            onClose
        } = this.props;

        if (!p) {
            return null;
        }

        return (
            <Modal
                className='pawn-info-modal'
                open={opened}
                hideBackdrop={true}
                onClose={onClose}
                style={{
                    right: position.x + 'px',
                    top: position.y + 'px',
                    width: '200px',
                }}
            >
                <main>
                    <PawnParameter title='Скорость' value={p.speed} />
                    <PawnParameter title='Здоровье' value={`${p.currentHealth} / ${p.maxHealth}`} />
                    <PawnParameter title='Урон' value={`${p.minDamage}-${p.maxDamage}`} />
                    <PawnParameter title='' value={p.movementType.enumKey} />
                </main>
                <footer>
                    <button className='close-button' onClick={onClose}>
                        Закрыть
                    </button>
                </footer>
            </Modal>
        );
    }
}