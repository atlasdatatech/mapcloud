import { Component } from 'react';
import Modal from '../../../components/modals/BaseModal';
import styles from './IconUpload.less';
import classNames from 'classnames';
import { ajax_upload_file_width_progress} from '../../../utils/ajax';
import { Selection, UploadInput } from '../../../components/controls/Input';
import { superbytes, getFileNameExt } from '../../../utils/file';
import { ICON_LIMIT_SIZE, UPLOAD_ICON_TYPES } from '../../../const/core';
import { Icon, Alert } from "@blueprintjs/core";
import Local from '../../../utils/local';
import Toaster from '../../../components/Toaster';

export default class IconUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: '0%',
            step: 1,
            cancel: null,
            err: '',
            showAlert: false,
        }
    }

    handleUpload = ({files, isValidate}) => {
        if(!isValidate) {
            Toaster.show({
                intent: 'danger',
                icon: 'error',
                message: '您上传的文件不符合要求，请检查上传文件类型与大小',
            });
            return;
        }
        const {mapId} = this.props;
        this.setState({step: 2});
        ajax_upload_file_width_progress({
            url: `maps/icons/${mapId}/`, 
            data:files, 
            mode: 'multi',
            setCancelToken: (c) => { this.setState({cancel: c}); },
            onUploadProgress: (e) => {this.setState({progress: e});}
        }).then((res) => {
            if(res && res.code === 200 ) {
                // 初始化数据
                Toaster.show({message:'上传成功', intent: 'success', 
                    icon:'tick-circle', timeout:2000});
                setTimeout(() => {
                    const { uploadedHandler } = this.props;
                    uploadedHandler && uploadedHandler();
                }, 1000);
                this.cancel();
            } else {
                this.setState({err: res.msg});
                Toaster.show({message:'上传错误：' + res.msg, intent: 'danger', icon:'error'});
            }
        });
    }

    _cancel = () => {
        const { cancel } = this.state;
        cancel && cancel();
        this.setState({showAlert: false, step: 1, progress:'0%', cancel: null, err:""});
        const { cancelUpload } = this.props;
        cancelUpload(false);
    }

    cancel = () => {
        const {step, progress} = this.state;
        if(step === 2 && progress !== '100%') {
            this.setState({showAlert: true});
            return;
        }
        this._cancel();
    }

    render() {
        const { isOpen } = this.props;
        const {step, progress, err} = this.state;
        return (
            <Modal 
            title='上传图标' 
            confirm = {false}
            icon='cloud-upload'
                className={classNames(styles.modal)}
                isOpen={isOpen} 
                handleClose = {this.cancel}
                >
                <div className={styles.content}>
                    <p className='mgb-2 pt-2'>请选择要上传的文件</p>
                    <div className={classNames(styles.area, 'flex-vertical-center at-upload-area')}>
                        <Icon icon="add" iconSize={30}  />&nbsp;&nbsp; 
                        将文件拖至此处 或 <a href='javascript:;'>点击上传</a>, 
                        &nbsp;&nbsp;单个文件大小不超过 {superbytes(ICON_LIMIT_SIZE)}
                        <UploadInput 
                            className={styles.fileInput} 
                            limitSize = {ICON_LIMIT_SIZE}
                            mode = 'multi'
                            limitExts = {UPLOAD_ICON_TYPES} 
                            onChange = {this.handleUpload} />
                </div>
                <div className={styles.note}>
                    <p className='align-center'>推荐SVG文件，支持多个SVG、PNG、JPG、BMP、GIF格式的图标文件上传</p>
                </div>
                </div>
                { step === 2 && (
                    <div className={styles.progress}>
                        <p className='mgb-1'>{progress !== '100%' 
                        ? ('正在上传中...' + progress) 
                        : (err ? err : '正在进行上传处理，请稍后...')}</p>
                        <div className={classNames("bp3-progress-bar", err ? "bp3-intent-danger" :"bp3-intent-success")}>
                            <div className="bp3-progress-meter" style={{width: progress}}></div>
                        </div>
                    </div>
                )}
                {this.state.showAlert && <Alert icon='cloud-upload' 
                    intent='warning' 
                    cancelButtonText='取消' 
                    confirmButtonText='确认'
                    isOpen = {this.state.showAlert}
                    onCancel={() => {this.setState({showAlert: false})}} 
                    onConfirm={this._cancel}
                >正在上传中，确定退出吗？</Alert> }
            </Modal>
        )
    }
}