import { Component } from 'react';
import classNames from 'classnames';
import Modal from '../../components/modals/BaseModal';
import styles from './Preview.less';
import ScrollWrapper from '../../components/ScrollWrapper';
import { Button, EditableText, Alert, Icon } from "@blueprintjs/core";
import {Selection, UploadInput} from '../../components/controls/Input';
import { getFieldType, FIELD_TYPE } from '../../utils/data';
import { DATASET_LIMIT_SIZE, UPLOAD_DATASET_TYPES } from '../../const/core';
import BlankCreate from '../../components/BlankCreate';
import Toaster from '../../components/Toaster';
import {superbytes} from '../../utils/file';
import { validateFile } from '../../utils/file';
import {ajax_get, ajax_upload_file_width_progress, ajax_post} from '../../utils/ajax';
import Local from '../../utils/local';
import { isArray, getObjectFromArray,merge } from '../../utils/util';
import { taskHelper } from '../../utils/task';
import { connect } from 'dva';

class Preview extends Component {
    constructor(props) {
        super(props);
    }

    close = () => {
        const { handleCurrentPreview } = this.props;
        if(handleCurrentPreview) {
            handleCurrentPreview({show: false, preview: null});
        }
    }

    handleOk = () => {
        const  { preview, task, handleUpdatePreview } = this.props;
        if(!task || !preview) return;
        const dataset = taskHelper.getPreview({id: task, previewId: preview});
        if(!dataset) return;
        ajax_post({
            url: `datasets/import/${preview}/`,
            data: dataset
        }).then((res) => {
            // 添加任务
            if(res && res.code === 200 && res.data && res.data.id) {
                taskHelper.addHandle(res.data);
            } else {

            }
        });
    }

    render() {
        const  { isOpen, dict, preview, task, handleUpdatePreview, handleType } = this.props;
        if(!isOpen || !preview || !dict || !task) return null;
        const dataset = taskHelper.getPreview({id: task, previewId: preview});
        if(!dataset) return null;

        const {fieldTypes, encodings, crss} = dict;
        const fields = ((dataset && dataset.fields) || []).filter(e => e);
        const records = ((dataset && dataset.rows) || []).slice(0, 7).filter(e => e);

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

        const hasFields = isArray(fields) && fields.length > 0;

        return (
            <Modal 
                isOpen={isOpen} 
                title= "数据集预览与入库配置"
                icon="property" 
                confirm = {false}
                confirmTitle = "开始入库"
                className={ hasFields ? styles.modal : styles.noFieldsModal}
                handleClose = {this.close}
                >
                <div className={styles.tableset}>
                    {hasFields && <p className='mgb-1'>您可以修改字段名称与类型、编码、坐标系以及CSV文件的经纬度字段</p>}
                    {hasFields && <div className={styles.scrollTable}>
                    <ScrollWrapper>
                        <table className='at-bg-default at-table-border-light'>
                            <tbody>
                                <tr className='at-bg-light'>
                                    <td>#</td>
                                    {fields.map((f, index) => {
                                        return (
                                            <td key={index}>
                                            <div className={classNames(styles.tableHead, "flex-vertical")}>
                                                <div><EditableText 
                                                value={f.name} 
                                                onChange={(e) => { 
                                                    handleUpdatePreview({key: 'fieldName', field:f, value: e});
                                                }}
                                                placeholder='点击输入'  /></div>
                                                <div style={{minWidth: '70px', marginRight: '10px'}}>
                                                <Selection value={f.type} options={fieldTypeOptions} 
                                                    onChange={(v) => { 
                                                        handleUpdatePreview({key: 'fieldType', field:f, value: v});
                                                    }} />
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
                    </ScrollWrapper>
                    </div>
                    }
                    {!hasFields && <BlankCreate desc="此数据集没有属性数据" className='pt-1 pb-1' style={{transform:'scale(0.8)'}} />}
                    <div className={classNames(styles.options, styles.lineOption, 'row', 'mgb-2')}>
                        <div className='columns six pd0'>
                            <Selection title={'字段编码：'} options={encodingOptions} 
                                value={encoding} onChange={(e) => {
                                    handleUpdatePreview({key: 'encoding', value: e});
                                }} />
                        </div>
                        <div className='columns six pd0'>
                            <Selection title={'坐标系：'} options={crsOptions} value={crs} onChange={(e) => {
                                handleUpdatePreview({key: 'crs', value: e});
                            }}
                                />                               
                        </div>
                    </div>
                    {isCSV && <div className={classNames(styles.options, styles.lineOption, 'row mgb-2')}>
                        <div className='columns six pd0'>
                            <Selection title={'选择经度 lng：'} options={fieldOptions} 
                                value={lngField} 
                                onChange={(v) => {
                                    handleUpdatePreview({key: 'lng', value: v});
                                }} />
                        </div>
                        <div className='columns six pd0'>
                            <Selection title={'选择纬度 lat：'} options={fieldOptions} 
                                value={latField} 
                                onChange={(v) => {
                                    handleUpdatePreview({key: 'lat', value: v});
                                }} />                               
                        </div>
                    </div>}
                </div>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
      dict: state.dict,
    };
}

export default connect(mapStateToProps)(Preview);