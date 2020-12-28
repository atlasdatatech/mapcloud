import { Component } from "react";
import styles from './Share.less';
import classNames from 'classnames';
import Modal from './BaseModal';
import ClipInput from '../ClipInput';
import QRCode from 'qrcode.react';

export default (props) => {
    
    const  { title, isOpen, className, handleClose, url, size } = props;

    return (
        <Modal className={classNames(styles.modal, className)}
            icon = 'share'
            confirm = {false}
            title = {title || '分享'}
            isOpen = {isOpen}
            handleClose = {handleClose}
            >
            <div className={styles.content}>
                <div className={classNames(styles.area)}>
                    <QRCode value={url} size={size || 200} />
                    <div className={classNames(styles.clip, 'pt-2')}>
                        <ClipInput value={url} {...props} />
                    </div>
                </div>
                {props.children}
            </div>
        </Modal>
    )
}