import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../util/Modal';

export default class FightSummaryModal extends React.Component {

    static propTypes = {
        summary: PropTypes.object,
        opened: PropTypes.bool,
        onClose: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    render() {
        let {
            summary: s,
            opened,
            onClose
        } = this.props;

        return (
            <Modal
                className='fight-summary-modal'
                open={opened}
                onClose={onClose}
            >
                <main>
                    <pre>
                        {JSON.stringify(s, null, '  ')}
                    </pre>
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