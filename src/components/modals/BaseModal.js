import {Component} from 'react';
import { Dialog, Classes, Button, Intent } from "@blueprintjs/core";
import classNames from 'classnames';
import styles from './BaseModal.less';

function ConfirmFooter(props) {
    const { okTitle, closeTitle } = props;
    return (
    <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={props.handleClose} style={{minWidth: '120px', height: '36px'}}>
                {closeTitle || '取消' }
            </Button>
            <Button onClick= {props.handleOk}
                disabled={props.disabled}
                intent={Intent.PRIMARY}
                style={{minWidth: '120px', height: '36px'}}
            >
                { okTitle || "确定" }
            </Button>
        </div>
    </div>
    );
}

export default class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            autoFocus: true,
            canEscapeKeyClose: true,
            canOutsideClickClose: false,
            enforceFocus: true,
            usePortal: true,
        };
    }

    render() {
        const {className, confirm, handleClose, handleOk, okDisabled, confirmTitle, closeTitle } = this.props;
        const confirmContent = (confirm || confirm === undefined) ? 
            <ConfirmFooter 
                handleClose={handleClose} 
                handleOk={handleOk} 
                disabled ={okDisabled}
                okTitle = {confirmTitle}
                closeTitle = {closeTitle}
            /> : null;

        return (
            <Dialog 
            className={classNames(className, styles.modal)}
            onClose={handleClose}
            {...this.state}
            {...this.props}
            >
            {this.props.children}
            { confirmContent }
            </Dialog>
        );
    }
}