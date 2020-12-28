import { Component } from 'react';
import classNames from 'classnames';
import Modal from '../../../components/modals/BaseModal';
import styles from './CreateDatasetModal.less';
import ScrollWrapper from '../../../components/ScrollWrapper';
import { Button, EditableText, Alert, Icon } from "@blueprintjs/core";
import {Selection, UploadInput} from '../../../components/controls/Input';
import { getFieldType, FIELD_TYPE } from '../../../utils/data';
import { DATASET_LIMIT_SIZE, UPLOAD_DATASET_TYPES } from '../../../const/core';
import { ExIcon } from '../../../components/common';
import BlankCreate from '../../../components/BlankCreate';
import Toaster from '../../../components/Toaster';
import {superbytes, getFileSize, getFilename} from '../../../utils/file';
import { validateFile } from '../../../utils/file';
import {ajax_get, ajax_upload_file_width_progress, ajax_post} from '../../../utils/ajax';
import Local from '../../../utils/local';
import { isArray, getObjectFromArray,merge } from '../../../utils/util';
import { taskHelper} from '../../../utils/task';


{/* <p className='lh2'>
    <strong>坐标系说明</strong>：入库将统一转换为<strong>WGS84坐标系</strong><br />
    WGS84坐标系：GPS设备采集的数据、谷歌地球均采用该坐标系<br/>
    CGCS2000坐标系：2000国家大地坐标系，国家测绘成果均采用该坐标系<br/>
    GCJ02坐标系：俗称火星坐标系，高德、腾讯、谷歌等互联网地图均采用该坐标系<br/>
    百度坐标系：百度地图所采用的坐标系<br/>
</p> */}
/**
 * 创建数据集 - 通过文件上传方式上传
 * 上传完成后编辑字段属性名称、类型
 * 选择编码
 * 选择坐标系
 */

export default class CreateDatasetModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 1, // 1 上传, 2 上传中, 3 上传完成
            showAlert: false,
            progress: '0%',
            datasets: [],
            currentDatasetId: null,

            cancel: null,
            showUploadCancelAlert: false, 
        }
    }

    handleUpload = ({files, isValidate}) => {
        if(!files || !files[0] || !isValidate) {
            Toaster.show({
                intent: 'danger',
                icon: 'error',
                message: '您上传的文件不符合要求，请检查上传文件类型与大小'
            });
            return;
        }
        for(let i = 0; i < files.length; i++) {
            taskHelper.addTask({
                file: files[i],
                type: 'dataset',
            });
        }
        taskHelper.showModal(true);
        this._cancel();
    }

    /**
     * 更新步骤
     * @param {Number} step 1 上传, 2 上传中, 3 上传完成
     */
    updateStep = (step) => {
        this.setState({step});
    }

    cancel = () => {
        const {step, progress} = this.state;
        if(step === 2 && progress !== '100%') {
            this.setState({showUploadCancelAlert: true});
            return;
        }
        if(step === 3) {
            this.setState({showAlert: true});
            return;
        } 
        this._cancel();
    }

    _cancel = () => {
        const { handleCreateDatasetModal } = this.props;
        this.setState({showAlert: false, showUploadCancelAlert: false});
        const {cancel} = this.state;
        if(cancel) {
            cancel();
        }
        handleCreateDatasetModal(false);
        setTimeout(() => {
        }, 200);
    }

    render() {
        const  { isOpen, fieldTypes,encodings,crss  } = this.props;
        const {step, progress } = this.state;

        return (
            <Modal className={classNames(styles.modal)}
                icon='cloud-upload'
                confirm = {false}
                title = { `创建数据集 - ${step !== 3 ? '上传数据' : '数据预览'}`}
                isOpen = {isOpen}
                portalClassName = {'hello'}
                handleClose = {this.cancel}
                >
                {
                    (step === 1 || step === 2) && (
                        <div className={styles.content}>
                            <div className={classNames(styles.area, 'flex-vertical-center at-upload-area')}>
                                <div></div>
                                <Icon icon="add" iconSize={30}  />
                                &nbsp;&nbsp;将文件拖至此处 或 <a href='javascript:;'>点击上传</a>
                                <UploadInput className={styles.fileInput} 
                                    limitSize = {DATASET_LIMIT_SIZE}
                                    limitExts = {UPLOAD_DATASET_TYPES} 
                                    mode = "multi"
                                    onChange = {this.handleUpload} />
                        </div>
                        <h6>上传说明：</h6>
                        <p>支持的文件格式：SHP(zip压缩包)、CSV(点数据)、GeoJSON、KML、GPX</p>
                        <p>文件大小不超过 {superbytes(DATASET_LIMIT_SIZE)}</p>
                    </div>
                    )
                }
            </Modal>
        )
    }
}