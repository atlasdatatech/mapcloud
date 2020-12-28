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
import {superbytes} from '../../../utils/file';
import { validateFile } from '../../../utils/file';
import {ajax_get, ajax_upload_file_width_progress, ajax_post} from '../../../utils/ajax';
import Local from '../../../utils/local';
import { isArray, getObjectFromArray,merge } from '../../../utils/util';

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

    getDataset = () => {
        const {currentDatasetId, datasets} = this.state;
        return getObjectFromArray(datasets, 'id', currentDatasetId);  
    }

    getFields = () => {
        const dataset = this.getDataset();
        return ((dataset && dataset.fields) || []).filter(e => e);
    }

    getRecords = () => {
        const dataset = this.getDataset();
        return ((dataset && dataset.rows) || []).slice(0, 7).filter(e => e);
    }

    toOneStep = () => {
        this.setState({
            step: 1, 
            showAlert: false,
            progress: '0%',
            datasets: [],
            currentDatasetId: null,
            cancel: null, 
            showUploadCancelAlert: false
        });
    }

    _initDatasets = (datasets) => {
        datasets.forEach((dataset) => {
            // 初始化经纬度选择字段
            if(dataset && dataset.geotype && dataset.geotype.indexOf(',') >= 0 
                && dataset.format === '.csv') {
                const lngLat = dataset.geotype.split(',');
                if(!lngLat[0]) {
                    lngLat[0] = dataset.fields[0].name;
                }
                if(!lngLat[1]) {
                    lngLat[1] = dataset.fields[0].name;
                }
                dataset.geotype = lngLat.join(',');
            }
        });
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
        const url = `datasets/upload/`;
        this.setState({step: 2});
        ajax_upload_file_width_progress({
            url, 
            data:files[0], 
            setCancelToken: (c) => { this.setState({cancel: c}); },
            onUploadProgress: (e) => {this.setState({progress: e});}
        }).then((res) => {
            if(res && res.code === 200 && res.data 
                && isArray(res.data) && res.data.length > 0) {
                // 初始化数据
                this._initDatasets(res.data);
                this.setState({
                    datasets: (res.data || []).filter(d => d),
                    step: 3, 
                    currentDatasetId: res.data[0] && res.data[0]['id']
                });
            } else {
                Toaster.show({message:'上传错误', intent: 'danger'});
            }
        });
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
        // this.toOneStep();
        handleCreateDatasetModal(false);
        setTimeout(() => {
        }, 200);
    }

    /**
     * 
     */
    updatePreviewByEncoding = (encoding) => {
        const dataset = this.getDataset();
        if(!dataset || dataset.encoding === encoding) return;
        const {currentDatasetId, datasets} = this.state;
        datasets.forEach((d) => {
            if(d.id === currentDatasetId) {
                d.encoding = encoding;
                return;
            }
        });
        this.setState({datasets});

        ajax_get({
            url:`datasets/preview/${currentDatasetId}/`, 
            data: {encoding}
        }).then((res) => {
            datasets.forEach((d) => {
                if(d.id === currentDatasetId) {
                    d.rows = (res.data.rows || []).filter(d => d);
                    return;
                }
            });
            this.setState({datasets});
        })
    }

    /**
     * 变更属性字段类型
     */
    fieldTypeOnChange = ({field,value}) => {
        const {currentDatasetId, datasets} = this.state;
        if(currentDatasetId && datasets.length > 0) {
            for(let i = 0, len = datasets.length; i < len; i++) {
                if(datasets[i].id === currentDatasetId) {
                    datasets[i].fields.forEach((f) => {
                        if(f.name === field.name) {
                            f.type = value;
                        }
                    })
                    break;
                }
            }
            this.setState({datasets});
        }
    }

    /**
     * 变更经纬度选择字段
     */
    lngLatFieldOnChange = ({key, value}) => {
        const {currentDatasetId, datasets} = this.state;
        datasets.forEach((d) => {
            if(d.id === currentDatasetId && d.geotype && d.geotype.indexOf(',') >= 0) {
                const lngLat = d.geotype.split(',');
                if(key === 'lng') {
                    lngLat[0] = value;
                }
                if(key === 'lat') {
                    lngLat[1] = value;
                }
                d.geotype = lngLat.join(',');
                return;
            }
        });
        this.setState({datasets});
    }

     /**
     * 更新字段名称
     */
    updateCRS = (crs) => {
        const {currentDatasetId, datasets} = this.state;
        if(!currentDatasetId || !datasets || !crs) return;
        datasets.forEach((d) => {
            if(d.id === currentDatasetId) {
                d.crs = crs;
                return;
            }
        });
        this.setState({datasets});
    }

    /**
     * 更新字段名称
     */
    updateFieldName = ({field, value}) => {
        const {currentDatasetId, datasets} = this.state;
        if(!currentDatasetId || !datasets || !field || value == undefined) return;
        datasets.forEach((d) => {
            if(d.id === currentDatasetId) {
                d.fields.forEach((f) => {
                    if(f.name === field.name) {
                        f.name = value;
                        return;
                    }
                });
                return;
            }
        });
        this.setState({datasets});
    }

    validateDataset = () => {
        let isValidate = true;
        const {currentDatasetId, datasets} = this.state;
        if(!currentDatasetId || !datasets) return false;
        const fields = this.getFields();
        if(!fields.length) return false;
        datasets.forEach((d) => {
            // 字段名称不能为空
            d.fields.forEach((f) => {
                if(!f.name) {
                    isValidate = false;
                }
            });
            // CSV 经纬度选择
            if(d.format === '.csv') {
                const lngLat = d.geotype.split(',');
                if(lngLat.length !== 2 || !lngLat[0] || !lngLat[1]) {
                    isValidate = false;
                }
            }
        });
        return isValidate;
    }

    /**
     * 导入到数据库
     */
    handleImportDataset = () => {
        const { currentDatasetId } = this.state;
        const dataset = merge({}, this.getDataset());
        if(!currentDatasetId || !dataset) return;
        delete dataset.rows;
        ajax_post({
            url:`datasets/import/${currentDatasetId}/`, 
            data: dataset,
        }).then((res) => {
            if(res && res.code === 200 && res.data && res.data.id) {
                Toaster.show({message: '正在导入数据...', intent:'success', 
                timeout: 2000, icon:'tick-circle'});
                this._cancel();
                setTimeout(() => {
                    const { uploadedHandler } = this.props;
                    uploadedHandler && uploadedHandler();
                }, 1000);
            } else {
                Toaster.show({message: '数据导入失败：' + res.data.err, 
                    intent: 'danger', icon:'error'});
            }
        })
    }

    render() {
        const  { isOpen, fieldTypes, encodings, crss  } = this.props;
        const {step, progress } = this.state;
        const dataset = this.getDataset();
        const fields = this.getFields();
        const records = this.getRecords();

        // 字段类型可选项
        const fieldTypeOptions = fieldTypes.map((f) => {
            return {
                label: FIELD_TYPE[f],
                value: f,
            }
        });

        // 编码可选项
        const encodingOptions = encodings.map((f) => {
            return {
                label: f.toUpperCase(),
                value: f,
            }
        });
        const encoding = (dataset && dataset.encoding) || 'utf-8';

        // CRS可选项
        const crsOptions = crss.map((c) => {
            return {
                label: c.toUpperCase(),
                value: c,
            }
        });
        const crs = (dataset && dataset.crs) || 'WGS84';

        // 字段选择选项
        const fieldOptions = fields ? fields.map((f) => {
            return {
                label: f.name,
                value: f.name
            }
        }) : [];

        // CVS文件经纬度字段选择处理
        let lngField = '';
        let latField = '';
        const geotype = dataset && dataset.geotype;
        if(geotype && geotype.indexOf(',') >= 0) {
            const lngLat = geotype.split(',');
            lngField = lngLat[0];
            latField = lngLat[1];
        }
        const isCSV = dataset && dataset.format === '.csv';

        const isValid = this.validateDataset();

        const hasFields = isArray(fields) && fields.length > 0;

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
                            <p className='mgb-2 pt-2'>请选择要上传的文件</p>
                            <div className={classNames(styles.area, 'flex-vertical-center at-upload-area')}>
                                <Icon icon="add" iconSize={30}  />
                                &nbsp;&nbsp;将文件拖至此处 或 <a href='javascript:;'>点击上传</a>, 
                                &nbsp;&nbsp;文件大小不超过 {superbytes(DATASET_LIMIT_SIZE)}
                                <UploadInput className={styles.fileInput} 
                                    limitSize = {DATASET_LIMIT_SIZE}
                                    limitExts = {UPLOAD_DATASET_TYPES} 
                                    onChange = {this.handleUpload} />
                        </div>
                        <p style={{lineHeight: 1.5}}>支持的文件格式包括(详情说明)：<br/>SHP(zip压缩包)、CSV(点数据)、GeoJSON、KML、GPX</p>
                        { step === 2 && (
                            <div className={styles.progress}>
                                <p className='mgb-1 pt-2'>{
                                    progress !== '100%' ? ('正在上传中...' + progress) : '正在进行上传处理，请稍后'
                                }</p>
                                <div className="bp3-progress-bar bp3-intent-success">
                                    <div className="bp3-progress-meter" style={{width: progress}}></div>
                                </div>
                            </div>
                        )}
                    </div>
                    )
                }
                {
                    step === 3 && (
                        <div className={styles.tableset}>
                            {hasFields && <p className='mgb-1'>您可以在下方列表中修改属性字段名称与类型：</p>}
                            <div className={styles.scrollTable}>
                            <ScrollWrapper>
                                {
                                    hasFields && <table className='at-bg-default at-table-border-light'>
                                    <tbody>
                                        <tr className='at-bg-light'>
                                            <td >#</td>
                                            {fields.map((f, index) => {
                                                return (
                                                    <td key={index}>
                                                    <div className={classNames(styles.tableHead, "flex-vertical")}>
                                                        <div><EditableText 
                                                        value={f.name} 
                                                        onChange={(e) => { this.updateFieldName({field:f, value:e})}}
                                                        placeholder='点击输入'  /></div>
                                                        <div style={{minWidth: '70px', marginRight: '10px'}}>
                                                        <Selection value={f.type} options={fieldTypeOptions} 
                                                            onChange={(v) => { this.fieldTypeOnChange({field:f, value:v}) }} />
                                                        </div>
                                                    </div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                        {
                                            isArray(records) && records.map((record, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        {
                                                            record.map((r, idx) => {
                                                                return (<td key={idx}>{r}</td>);
                                                            })
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                }
                                {!hasFields && <BlankCreate desc="此数据集没有属性数据" className='pt-1 pb-1' style={{transform:'scale(0.8)'}} />}
                            </ScrollWrapper>
                            </div>
                            <div className={classNames(styles.options, styles.lineOption, 'row', isCSV ? 'mgb-2' : 'mgb-6')}>
                                <div className='columns four pd0'>
                                    <Selection title={'字段编码：'} options={encodingOptions} 
                                        value={encoding} onChange={this.updatePreviewByEncoding} />
                                </div>
                                <div className='columns four pd0'>
                                    <Selection title={'坐标系：'} options={crsOptions} value={crs} onChange={(e) => {this.updateCRS(e)}} />                               
                                </div>
                            </div>
                            {isCSV && <div className={classNames(styles.options, styles.lineOption, 'row mgb-2')}>
                                <div className='columns four pd0'>
                                    <Selection title={'选择经度 lng：'} options={fieldOptions} 
                                        value={lngField} 
                                        onChange={(v) => {this.lngLatFieldOnChange({key:'lng', value:v})}} />
                                </div>
                                <div className='columns four pd0'>
                                    <Selection title={'选择纬度 lat：'} options={fieldOptions} 
                                        value={latField} 
                                        onChange={(v) => {this.lngLatFieldOnChange({key:'lat', value:v})}} />                               
                                </div>
                            </div>}
                            <div className={styles.buttons}>
                                <Button large="true" onClick={this.toOneStep}>重新上传</Button>
                                <Button intent="primary" large="true" 
                                    onClick={this.handleImportDataset}>确认创建</Button>
                            </div>
                        </div>
                    )
                }
                {this.state.showUploadCancelAlert && <Alert 
                    icon='cloud-upload'
                    intent='warning'
                    isOpen={this.state.showUploadCancelAlert}
                    onCancel={() => { this.setState({showUploadCancelAlert: false}) }} 
                    onConfirm={this._cancel} 
                    cancelButtonText='取消' 
                    confirmButtonText='确认'>
                    数据还未上传成功，确认要退出吗?
                </Alert>}
                {this.state.showAlert && <Alert 
                    icon='warning-sign'
                    intent='warning'
                    isOpen={this.state.showAlert}
                    onCancel={() => { this.setState({showAlert: false}) }} 
                    onConfirm={this._cancel} 
                    cancelButtonText='取消' 
                    confirmButtonText='确认'>
                    数据上传还未处理完成，现在退出无法完成创建，确认退出吗？
                </Alert>}
            </Modal>
        )
    }
}