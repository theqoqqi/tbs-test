import './Modal.css';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import classNames from 'classnames';



/* Модифицированный код из примеров на https://mui.com/base/react-modal */

const BackdropUnstyled = React.forwardRef((props, ref) => {
    const { open, className, ...other } = props;
    return (
        <div
            className={classNames({ 'MuiBackdrop-open': open }, 'backdrop', className)}
            ref={ref}
            {...other}
        />
    );
});

BackdropUnstyled.propTypes = {
    className: PropTypes.string.isRequired,
    open: PropTypes.bool,
};



const StyledBackdrop = styled(BackdropUnstyled)(``);

const StyledModal = styled(ModalUnstyled)(``);

/* Конец кода из примеров */



export default class Modal extends React.Component {

    static propTypes = {
        contentProps: PropTypes.object,
    };

    static defaultProps = {
        contentProps: {},
    };

    render() {
        let {
            contentProps,
            ...modalProps
        } = this.props;


        return (
            <StyledModal
                {...modalProps}
                className={classNames('modal', this.props.className)}
                components={{ Backdrop: StyledBackdrop }}
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <div className='modal-content' {...this.props.contentProps}>
                    {this.props.children}
                </div>
            </StyledModal>
        );
    }
}