import { Component } from 'react';
import Modal from '../../../components/modals/BaseModal';
import styles from './CreateTilesetByUpload.less';
import classNames from 'classnames';
import { ajax_upload_file_width_progress} from '../../../utils/ajax';
import {Selection, UploadInput} from '../../../components/controls/Input';
import {superbytes, getFileNameExt} from '../../../utils/file';
import { TILESET_LIMIT_SIZE, UPLOAD_TILESET_TYPES, TILESET_MBTILES_LIMIT_SIZE } from '../../../const/core';
import { Alert, Icon } from "@blueprintjs/core";
import Local from '../../../utils/local';
import {taskHelper} from '../../../utils/task';
import Toaster from '../../../components/Toaster';


export default class CreateTilesetByUpload extends Component {
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

    handleUpload = ({files,isValidate}) => {
        if(!files || !files[0] || !isValidate) {
            Toaster.show({
                intent: 'danger',
                icon: 'error',
                message: '文件校验错误或您上传的文件不符合要求，请检查上传文件类型与大小',
            });
            return;
        }

        for(let i = 0; i < files.length; i++) {
            taskHelper.addTask({
                file: files[i],
                type: 'ts',
            });
        }
        taskHelper.showModal(true);
        this._cancel();

        // const suffix = getFileNameExt(files[0].name);
        // const url = suffix === 'mbtiles' ? `ts/upload/` : `ts/publish/`;
        // this.setState({step: 2});
        // ajax_upload_file_width_progress({
        //     url, 
        //     data:files[0], 
        //     setCancelToken: (c) => { this.setState({cancel: c}); },
        //     onUploadProgress: (e) => {this.setState({progress: e});}
        // }).then((res) => {
        //     if(res && res.code === 200 ) {
        //         // 初始化数据
        //         Toaster.show({message:'上传成功', intent: 'success', 
        //             icon:'tick-circle', timeout:2000});
        //         setTimeout(() => {
        //             const { uploadedHandler } = this.props;
        //             uploadedHandler && uploadedHandler();
        //         }, 1000);
        //         this.cancel();
        //     } else {
        //         this.setState({err: res.msg});
        //         Toaster.show({message:'上传错误：' + res.msg, intent: 'danger', icon:'error'});
        //     }
        // });
    }

    _cancel = () => {
        const { cancel } = this.state;
        cancel && cancel();
        this.setState({showAlert: false, step: 1, progress:'0%', cancel: null, err:""});
        const { handleCreateTilesetByUploadModal } = this.props;
        handleCreateTilesetByUploadModal(false);
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
        const {
            openCreateTilesetByUploadModal, 
        } = this.props;
        const {step, progress, err} = this.state;
        return (
            <Modal 
            title='创建服务集 - 上传' 
            confirm = {false}
            icon='cloud-upload'
                className={classNames(styles.modal)}
                isOpen={openCreateTilesetByUploadModal} 
                handleClose = {this.cancel}
                >
                <div className={styles.content}>
                    <p className='mgb-2 pt-2'>请选择要上传的文件</p>
                    <div className={classNames(styles.area, 'flex-vertical-center at-upload-area')}>
                        <Icon icon="add" iconSize={30}  />&nbsp;&nbsp;
                        将文件拖至此处 或 <a href='javascript:;'>点击上传</a>
                        <UploadInput className={styles.fileInput} 
                            limitSize = {{
                                mbtiles: TILESET_MBTILES_LIMIT_SIZE,
                                default: TILESET_LIMIT_SIZE
                            }}
                            limitExts = {UPLOAD_TILESET_TYPES} 
                            onChange = {this.handleUpload} />
                </div>
                <div className={styles.note}>
                    <p>1、.mbtiles 文件大小不超过{superbytes(TILESET_MBTILES_LIMIT_SIZE)}
                        &nbsp;&nbsp;,其它格式文件大小不超过 {superbytes(TILESET_LIMIT_SIZE)}</p>
                    <p>2、创建矢量服务集：请上传 mbtiles、geojson、shapefile（zipped）格式</p>
                    <p>3、创建影像服务集：请上传 mbtiles、geotiff 文件</p>
                </div>
                </div>
                { step === 2 && (
                    <div className={styles.progress}>
                        <p className='mgb-1'>{progress !== '100%' 
                        ? ('正在上传中...' + progress) 
                        : (err ? ('数据处理报错，请检查上传文件是否符合要求。' + err) : '数据已接收完毕，正在进行上传处理，请稍后...')}</p>
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