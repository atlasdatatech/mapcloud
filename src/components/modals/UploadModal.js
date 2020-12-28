import { Component } from 'react';
import classNames from 'classnames';
import Modal from './BaseModal';
import styles from './UploadModal.less';


export default (props) => {
    
    const  { handleUpload, title, isOpen, className, handleClose } = props;

    return (
        <Modal className={classNames(styles.modal, className)}
            icon={<i className="iconfont">&#xe62b;</i>}
            confirm = {false}
            title = {title || '上传'}
            isOpen = {isOpen}
            handleClose = {handleClose}
            >
            <div className={styles.content}>
                <p className='mgb-2 pt-2'>请选择要上传的文件</p>
                <div className={classNames(styles.area, 'flex-vertical-center at-upload-area')}>
                    <i className="iconfont">&#xe62b;</i> 将文件拖至此处 或 <a href='javascript:;'>点击上传</a>
                    <input type="file" 
                       name="file"
                       className = {styles.fileInput}
                       onChange={(e)=>{handleUpload && handleUpload(e.target.files)}} /> 
                </div>
                {props.children}
            </div>
        </Modal>
    )
}