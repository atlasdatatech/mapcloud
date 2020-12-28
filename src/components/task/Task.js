import { Component } from 'react';
import classNames from 'classnames';
import styles from './Task.less';
import { Button, ButtonGroup, Popover, Menu, MenuItem, Slider, RangeSlider, Switch, Collapse, Card, Elevation, Icon, Tooltip  } from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
import { ExIcon} from '../common';
import Select from 'react-select';
import ScrollWrapper from '../ScrollWrapper';
import { DatasetItem, TsItem } from './Item';
import {trim} from '../../utils/util';
import {taskHelper} from '../../utils/task';
import Preview from './Preview';

export default class Task extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            collapse: true, // 是否扩展面板，默认扩展
            showRemoveAlert: false,
            showPreview: false,
            currentPreview: null,
            currentTask: null,
            previeNeedUpdate: null,
        }
    }

    toggleCollapse = () => {
        this.setState({collapse: !this.state.collapse});
    }

    /**
     * 预览处理
     */
    handleCurrentPreview = ({id, previewId, show}) => {
        this.setState({currentPreview: previewId, showPreview: show, currentTask: id});
    }

    /**
     * 预览修改
     */
    handleUpdatePreview = ({key, value, field}) => {
        const { currentPreview, currentTask }= this.state;
        const id = currentTask;
        const previewId = currentPreview;
        if(!id || !previewId) return;

        if(key === 'encoding') {
            taskHelper.updatePreviewByEncoding({id, previewId, encoding: value});
        }
        if(key === 'crs') {
            taskHelper.updateCRS({id, previewId, crs: value});
        }
        if(key === 'lng') {
            taskHelper.lngLatFieldOnChange({id, previewId, key:'lng', value});
        }
        if(key === 'lat') {
            taskHelper.lngLatFieldOnChange({id, previewId, key:'lat', value});
        }
        if(key === 'fieldType' && field) {
            taskHelper.fieldTypeOnChange({id, previewId, field, value});
        }
        if(key === 'fieldName' && field) {
            taskHelper.updateFieldName({id, previewId, field, value});
        }

        this.setState({previeNeedUpdate: Math.random() * 0.1});
    }

    /**
     * 关闭任务列表
     */
    closeHandle = () => {

    }

    render() {
        const {collapse, currentPreview, showPreview, currentTask, previeNeedUpdate} = this.state;
        const {task} = this.props;
        const msg = taskHelper.getStatus();
        const isOpen = collapse && task && task.length > 0;
        const hasUploadingTask = task.filter(t => t.progress !== "100%").length > 0;
        const hasErrorTask = task.filter(t => t.error).length > 0;
        const hasEndTask = task.filter(t => t.handleProgress === "100%").length > 0;
        const hasWaitingHandleTask = taskHelper.hasWaitingHandleTask();
        const menu = <Menu>
            <MenuItem text="清除已完成的任务" icon="endorsed" disabled={!hasEndTask} onClick={taskHelper.removeEndTask} />
            <MenuItem text="删除待处理任务" icon="time" disabled={!hasWaitingHandleTask} onClick={taskHelper.removeWatingHandleTask} />
            <MenuItem text="清除无效的任务" icon="warning-sign" disabled={!hasErrorTask} onClick={taskHelper.removeErrorTask} />
            <MenuItem text="中止正在上传的任务" icon="disable" disabled={!hasUploadingTask} onClick={taskHelper.removeUploadingTask} />
        </Menu>
        return (
            <div className={styles.main}>
                <Card elevation={Elevation.THREE} className={styles.card}>
                    <div className={classNames(styles.head, "flex-vertical")}>
                        <div className="flex-vertical">
                            <Icon icon='time' />
                            <p>任务完成</p>
                        </div>
                        <div className="flex-vertical">
                            <ButtonGroup minimal='true'>
                                <Popover content={menu}>
                                <Button small={true} 
                                    icon={"more"} />
                                </Popover>
                                {task.length > 0 && <Button small={true} 
                                    onClick={this.toggleCollapse}
                                    icon={isOpen ? "caret-down" : "caret-up"} /> }
                                <Button icon="minus" small={true}
                                    onClick={() => {taskHelper.showModal(false)}}
                                />
                                {/* <Button small={true} icon="cross" /> */}
                            </ButtonGroup>
                        </div>
                    </div>
                    {/* 任务数据 */}
                    <div className={styles.info}>
                        <div>
                            <Tooltip content="如果有正在上传的文件，刷新页面会取消上传">
                                <Icon icon="info-sign" intent="primary" />
                            </Tooltip>
                        </div>
                        <div>
                        {
                            !msg && <p>无数据上传与处理任务</p>
                        }
                        {
                            msg && <p>
                                <span>上传中：{msg.upload}</span>
                                <span>上传完成：{msg.uploadEnd}</span>
                                <span>待处理：{msg.waitHandle}</span>
                                <span>处理中：{msg.handle}</span>
                                <span>处理完成：{msg.handleEnd}</span>
                                <span>错误：{msg.error}</span>
                            </p>
                        }
                        </div>
                    </div>
                    <Collapse isOpen={isOpen}>
                        <div className={styles.list}>
                            <ScrollWrapper className={styles.scroll}>                            
                                <div className={styles.scrollContent}>
                                    <ul>
                                        {
                                            task.map((t, index) => {
                                                return <li key={t.id + index}>
                                                    {t.type === 'dataset' ? <DatasetItem task={t} handleCurrentPreview={this.handleCurrentPreview} /> : <TsItem task={t} />}
                                                </li>
                                            })
                                        }
                                    </ul>
                                </div>
                            </ScrollWrapper>
                        </div>
                    </Collapse>
                </Card>
                {showPreview && <Preview 
                    isOpen = {showPreview} 
                    preview = {currentPreview}
                    task = {currentTask}
                    previeNeedUpdate = {previeNeedUpdate}
                    handleUpdatePreview = {this.handleUpdatePreview}
                    handleCurrentPreview = {this.handleCurrentPreview}
                    />}
            </div>
        )
    }
}