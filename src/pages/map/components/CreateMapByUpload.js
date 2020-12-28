import { Component } from 'react';
import Modal from '../../../components/modals/BaseModal';
import classNames from 'classnames';
import styles from './CreateMapByUpload.less';
import {ajax_upload_file} from '../../../utils/ajax';
import {setRouter} from '../../../utils/router';
import {Selection, UploadInput} from '../../../components/controls/Input';
import { UPLOAD_STYLE_TYPES, STYLE_LIMIT_SIZE } from '../../../const/core';
import { ajax_upload_file_width_progress } from '../../../utils/ajax';
import { Alert, Icon } from "@blueprintjs/core";
import {superbytes, getFileNameExt} from '../../../utils/file';
import Toaster from '../../../components/Toaster';

export default class CreateMapByUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: '0%',
            step: 1,
            showAlert: false,
            cancel: null,
            err: '',
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
        const {map, type} = this.props;
        const url = map && type === 'replace' ? `maps/replace/${map.id}/` : `maps/upload/`;
        this.setState({step: 2});
        ajax_upload_file_width_progress({
            url, 
            data:files[0], 
            setCancelToken: (c) => { this.setState({cancel: c}); },
            onUploadProgress: (e) => {this.setState({progress: e});}
        }).then((res) => {
            if(res && res.code === 200 ) {
                if(map && type === 'replace') {
                    Toaster.show({message: '已替换', intent: 'success', 
                    icon:'tick-circle', timeout:2000});
                    setTimeout(() => {
                        const { updateHandler } = this.props;
                        updateHandler && updateHandler();
                    }, 1000);
                } else {
                    if(res.data) {
                        setRouter(`/map/edit/${res.data.id}`);
                    }
                }
                this.cancel();
            } else {
                this.setState({err: res.msg});
                Toaster.show({message:'错误：' + res.msg, intent: 'danger', icon:'error'});
            }
        });
    }

    cancel = () => {
        const {step, progress} = this.state;
        if(step === 2 && progress !== '100%') {
            this.setState({showAlert: true});
            return;
        }
        this._cancel();
    }

    _cancel = () => {
        const { onCancel } = this.props;
        onCancel(false);
        const { cancel } = this.state;
        cancel && cancel();
        this.setState({showAlert: false, step: 1, progress:'0%', cancel: null, err:""});
    }

    render() {
        const { isOpen, map }= this.props;
        const {step, progress, err} = this.state;
        return (
            <Modal 
                icon = 'upload'
                title = {map ? '替换地图' : '创建地图 - 上传创建' }
                isOpen={isOpen} 
                confirm = {false}
                className={styles.modal}
                handleClose = {this.cancel}
                >
                <div className={styles.content}>
                    <p className='mgb-2 pt-2'>请选择要上传的文件，文件大小限制 {superbytes(STYLE_LIMIT_SIZE)}</p>
                    <div className={classNames(styles.area, 'flex-vertical-center at-upload-area')}>
                        <Icon icon="add" iconSize={30}  />&nbsp;&nbsp;
                        将.zip 文件拖至此处 或 <a href='javascript:;'>点击上传</a>
                        <UploadInput className={styles.fileInput} 
                            limitSize = {STYLE_LIMIT_SIZE}
                            limitExts = {UPLOAD_STYLE_TYPES} 
                            onChange = {this.handleUpload} />
                    </div>
                    <div className="text-center">
                        请先将.json 样式文件打包成 zip 压缩包后再上传，仅支持 zip 文件上传
                    </div>
                </div>
                { step === 2 && (
                    <div className={styles.progress}>
                        <p className='mgb-1'>{progress !== '100%' 
                        ? ('正在上传中...' + progress) 
                        : (err ? ('样式处理报错，请检查上传文件是否符合要求。' + err) : '数据已接收完毕，正在进行上传处理，请稍后...')}</p>
                        <div className={classNames("bp3-progress-bar", err ? "bp3-intent-danger" :"bp3-intent-success")}>
                            <div className="bp3-progress-meter" style={{width: progress}}></div>
                        </div>
                    </div>
                )}
                <Alert icon='cloud-upload' 
                    intent='warning' 
                    cancelButtonText='取消' 
                    confirmButtonText='确认'
                    isOpen = {this.state.showAlert}
                    onCancel={() => {this.setState({showAlert: false})}} 
                    onConfirm={this._cancel}
                >正在上传中，确定退出吗？</Alert>
            </Modal>
        )
    }
}