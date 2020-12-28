import { Component } from 'react';
import classNames from 'classnames';
import styles from './Item.less';
import { Button, ButtonGroup, Alert, Collapse, Icon, Tooltip, Spinner  } from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
import { ExIcon} from '../common';
import Select from 'react-select';
import ScrollWrapper from '../ScrollWrapper';
import { superbytes } from '../../utils/file';
import Local from '../../utils/local';
import { taskHelper } from '../../utils/task';
import { getLayerTypeByGeometryType } from '../../utils/map';
import { getIcon }  from '../../utils/icon';
import { cloneJson } from '../../utils/util';


const errorMsg = '如您确认数据符合上传规则，但仍然上传失败，请联系技术支持';
const importErrorMsg = '如您确认数据符合上传规则，但任务仍然失败，请联系技术支持';

function getStatusColor(task) {
    if(task.progress !== '100%') return '#333';
    if(task.progress === '100%' && task.handleProgress !== '100%') return 'primary';
    if(task.error) return 'danger';
    if(task.status === 2) return 'warning';
    return 'success';
}

/**
 * 数据集图层列表项
 */
function LayerItem(props) {
    const isEnd = false;
    const { preview, handlePreview, task } = props;
    if(!preview) return null;
    const {id, name, geotype} = preview;
    const handle = taskHelper.getHandleByBase(id);
    const progress = preview.progress || 0;
    let status = <span className="bp3-tag bp3-minimal">正在入库</span>;
    if(progress <= 0) {
        status = <span className="bp3-tag bp3-minimal bp3-intent-primary">待入库</span>
    }
    if(progress === 100) {
        status = <span className="bp3-tag bp3-minimal bp3-intent-success">已入库</span>;
    }
    const error = preview.error || (handle && handle.error) || '';
    if(error) {
        status = <span className="bp3-tag bp3-minimal bp3-intent-danger">入库失败</span>;
    }
    const isSingle = task.previews.length === 1;
    return (
        <div className={ (styles.layer)}>
            <div className="flex-vertical">
                <div className={classNames(styles.layerInfo, "flex-vertical")}>
                    {/* 图层图标 */}
                    <div>{getIcon({type: getLayerTypeByGeometryType(geotype), iconSize: 16})}</div>
                    {/* 图层信息 */}
                    <div>
                        <h6 className="text-overflow">{name}</h6>
                        <p className="text-overflow">
                            {status}
                            <span title="文件格式" className="bp3-tag bp3-minimal">{preview.format}</span>
                            <span title="编码" className="bp3-tag bp3-minimal">{preview.encoding || 'utf-8'}</span>
                            {preview.total > 0 && <span title='元素数量' className="bp3-tag bp3-minimal ">{preview.total}</span>}
                            <span title="文件大小" className="bp3-tag bp3-minimal ">{superbytes(preview.size)}</span>
                        </p>
                    </div>
                </div>
                <div>
                    {
                        !isEnd && <div>
                            <ButtonGroup minimal={true}>
                                {/* 删除 */}
                                {
                                    progress !== 100 && <Button small={true} icon="settings" onClick={() => {
                                        handlePreview && handlePreview({show: true, previewId: id, id: task.id})
                                    }} title="预览与入库配置" />
                                }
                                
                                { !isSingle && <Button small={true} icon={'cross'} title="删除" onClick={() => {
                                    taskHelper.removePreview({id: task.id, previewId: id});
                                }} /> }
                            </ButtonGroup>
                        </div>
                    }
                    {/* 完成状态 */}
                    {
                        isEnd && <div>
                        <Icon icon={"endorsed"} intent={"success"} iconSize={16} color="#0e0" />
                        </div>
                    }
                    
                </div>
            </div>
            {
                progress >= 0 && progress !== 100 && <div className={classNames(styles.bar, styles.layerBar)}>
                <div className={classNames("bp3-progress-bar bp3-intent-primary", 
                    progress === 100 && "bp3-no-animation bp3-no-stripes"
                    )}>
                    <div className="bp3-progress-meter" style={{width: `${progress}%`}}></div>
                </div>
            </div>
            }
            {
                error && <div className={classNames(styles.info, "bp3-callout bp3-intent-danger")}>
                【入库失败】：{(error && (error + '。')) + importErrorMsg}
            </div>
            }
        </div>
    )
}

/**
 * 数据集上传列表项
 */
export class DatasetItem extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            collapse: false, // 是否扩展列表，默认不扩展，待上传这完成后再扩展
            showDelete: false,
        }
    }

    toggleCollapse = () => {
        this.setState({collapse: !this.state.collapse});
    }

    /**
     * 移除配置预览
     */
    removePreviewHandle = (previewId) => {
        const {task} = this.props;
        if(task && task.progress === '100%' && previewId) {
            const {id} = task;
            const preview = taskHelper.getPreview({id, previewId});
            if(preview) {
                taskHelper.removePreview({id, previewId});
            }
        }
    }

    /**
     * 统一配置入库
     */
    allPreviewHandle = () => {
        const {task, handleCurrentPreview} = this.props;
        if(!task || !task.previews || !task.previews.length) return;
        taskHelper.allPreviewsToHandle(task.id);
    }

    /**
     * 删除任务
     * 远程任务无法删除
     */
    removeTask = () => {
        const {task} = this.props;
        if(!task) return;
        if(task.cancel) {
            task.cancel();
        }
        taskHelper.removeTask(task.id);
    }

    render() {
        const { task, handleCurrentPreview } = this.props;
        if(!task) return null;
        const {collapse} = this.state;
        const uploadProgress = task.progress;
        const handleProgress = task.handleProgress;
        const uploadError = task.error;
        const uploadEnd = uploadProgress === '100%';
        const handleEnd = handleProgress === '100%';
        const isEnd = uploadProgress && handleEnd;
        const previews = task.previews || [];
        const isOpen = collapse && uploadEnd;
        // 是否数据集为单个图层
        return (
            <div className={styles.main}>
                <div className={classNames(styles.item, styles.dataset, uploadError && styles.error)}>
                    <div className="flex-vertical">
                        <div className="flex-vertical">
                            <div className={styles.icon} style={{marginRight: '0px'}} title="数据集">
                                <Icon icon="database" 
                                    iconSize={16} 
                                    intent = {getStatusColor(task)}
                                />
                                {previews.length > 0 && <div className={styles.iconTotal}> 
                                    <span className="bp3-tag bp3-intent-primary bp3-minimal bp3-round">
                                        {previews.length}</span>
                                </div>}
                            </div>
                            <div className={classNames(styles.title, "flex-vertical")}>
                                <div className="text-overflow" title={task.name}>{task.name}</div>
                                <div>{superbytes(task.size)}</div>
                            </div>
                        </div>
                        <div className="flex-vertical">
                            {/* 上传成功返回预览后功能与删除 */}
                            {
                                !isEnd && task.previews.length > 0 && <ButtonGroup minimal={true}>
                                    <Button 
                                        small={true} 
                                        intent="primary" 
                                        icon="flow-end" 
                                        text="一键入库"
                                        disabled = {task.status === 3 || task.status === 4}
                                        onClick={this.allPreviewHandle}
                                    />
                                    <Button 
                                        onClick = {() => { this.setState({showDelete: true}) }}
                                        icon="cross" 
                                        disabled = {!taskHelper.taskCanRemove(task.id)}
                                        small={true} 
                                    />
                                </ButtonGroup>
                            }
                            {/* 上传中, 上传错误，上传中断 删除 */}
                            {
                               (task.previews.length === 0 && (!isEnd || uploadError || task.status === 2)) && <Button 
                                onClick = {() => { 
                                    if(uploadError) {
                                        taskHelper.removeTask(task.id);
                                    } else {
                                        this.setState({showDelete: true});
                                    }
                                }}
                                disabled = {!taskHelper.taskCanRemove(task.id)}
                                icon="cross" 
                                small={true} 
                                minimal = {true}
                                />
                            }
                            {
                                isEnd && !uploadError && <Icon intent='success' 
                                    icon='endorsed' iconSize={16} style={{margin: '0 5px'}} />
                            } 
                            {
                                task.previews.length > 0 && <Button small={true} 
                                style={{marginLeft: 10}}
                                minimal={true}
                                onClick={this.toggleCollapse}
                                icon={isOpen ? "caret-up" : "caret-down"} />
                            }
  
                        </div>
                    </div>
                    {!uploadError && task.previews.length === 0 && <div className={classNames(styles.bar,
                        uploadProgress !== '100%' && styles.barTransition,
                        styles.uploadBar, 
                        uploadError && styles.error,
                        task.status === 2 && styles.uploadWarning
                        )} 
                        style={{width: uploadProgress}}>
                    </div>}
                    {/* {uploadEnd && <div className={classNames(styles.bar, styles.handleBar, uploadError && styles.error)}
                        style={{width: uploadError ?  0 : handleProgress}}>
                    </div>} */}
                </div>
                {
                    uploadError && <div className={classNames(styles.info, "bp3-callout bp3-intent-danger")}>
                        【任务失败】：{uploadError + '。\n' + errorMsg}
                    </div>
                }
                {
                    task.status === 2 && <div className={classNames(styles.info, "bp3-callout bp3-intent-warning")}>
                        【上传中断】：网络异常，上传已中断，异常修复后可尝试重新上传
                    </div>
                }
                {
                    <Collapse isOpen={isOpen}>
                    <div className={classNames(styles.preview)}>
                        <ul>
                            {previews.map((preview, index) => {
                                return <li key={preview.id + index}>
                                    <LayerItem preview={preview} task={task} handlePreview={handleCurrentPreview} />
                                </li>
                            })}
                        </ul>
                    </div>
                </Collapse>
                }
                
                {task.type === "dataset" && this.state.showDelete && <Alert 
                    icon='database'
                    intent='danger'
                    isOpen={this.state.showDelete}
                    onCancel={() => { this.setState({showDelete: false}) }} 
                    onConfirm={this.removeTask} 
                    cancelButtonText='取消' 
                    confirmButtonText='确认'>
                    【{task.name}】任务还未完成，确定要删除吗?
                </Alert>}
            </div>
        )
    }
}

/**
 * 服务集列表项
 */
export class TsItem extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const {task} = this.props;
        if(!task) return null;
        const uploadProgress = task.progress;
        const handleProgress = task.handleProgress;
        const handleTask = task.tasks && task.tasks[0];
        const handle = taskHelper.getHandleByBase(task.base);
        const uploadEnd = uploadProgress === '100%';
        const handleEnd = handleProgress === '100%';
        const isEnd = uploadEnd && handleEnd;
        const error = task.error || (handle && handle.error);
        const taskCanRemove = taskHelper.taskCanRemove(task.id);
        return (
            <div className={styles.main}>
                <div className={classNames(styles.item, styles.ts, error && styles.error)}>
                    <div className="flex-vertical">
                        <div className="flex-vertical">
                            <div style={{marginRight: '0px'}} title="服务集">
                                <Icon icon="box" iconSize={16} intent={getStatusColor(task)} />
                            </div>
                            <div className={classNames(styles.title, "flex-vertical")}>
                                <div className="text-overflow">{task.name}</div>
                                <div>{superbytes(task.size)}</div>
                            </div>
                        </div>
                        <div>
                            {
                                !isEnd && taskCanRemove && <Button 
                                    icon="cross" 
                                    minimal={true} 
                                    small={true} 
                                    onClick={() => {taskHelper.removeTask(task.id)}}
                                    disabled = {!taskCanRemove}
                                />
                            }
                            {
                                isEnd && !error && <Icon intent='success' icon='endorsed' iconSize={16} style={{marginLeft: '-54px'}} />
                            }   
                            {
                                uploadEnd && !isEnd && !error && <div style={{marginLeft: '-54px'}}><Spinner size={20} intent='primary' /></div>
                            }  
                        </div>
                    </div>
                    {uploadProgress !=='100%' && !error && <div className={classNames(styles.bar, styles.uploadBar, error && styles.error)} 
                        style={{width: uploadProgress}}>
                    </div>}
                    {!isEnd && !error && uploadEnd && <div className={classNames(styles.bar, styles.handleBar, error && styles.error)}
                        style={{width: handleProgress}}>
                    </div>}
                </div>
                {
                    error && <div className={classNames(styles.info, "bp3-callout bp3-intent-danger")}>
                        【任务失败】：{error + '。\n' + errorMsg}
                    </div>
                }
                
            </div>
        )
    }
}
