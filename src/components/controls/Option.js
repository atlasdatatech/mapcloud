import { Component } from 'react';
import classNames from 'classnames';
import styles from './Option.less';
import { Button, Icon, Tooltip } from "@blueprintjs/core";
import {ExIcon} from '../common';
import ButtonJsonEditor from './ButtonJsonEditor';

/**
 * 配置项组件
 * @param {*} props 
 */
export default function Option(props) {
    const { 
        jsonObject,  // json代码值
        jsonChange,  // json代码更新事件
        title,  // 配置项标题
        tip, // 提示
        panel,  // 配置项内容
        setDefaultHandle,  // 设置默认值事件
        height,  // json 编辑器高度
        openJsonEditor,  // 是否打开JSON编辑器
        handleJsonEditor,  // 设置JSON编辑打开状态
        enableJsonEditor,
        lint,
     } = props;
    return (
        <div className={classNames(styles.optionWrapper, 'pt-1 pb-1')}>
            <div className={classNames(styles.head, 'flex-vertical')}>
                <h6> { tip && <Tooltip position='right' content={tip}><Icon intent='primary' icon="help" /></Tooltip> } <span>{title}</span></h6>
                <div>
                {/* 设默认值 */}
                {setDefaultHandle && <Button icon="small-cross" small='true' minimal='true' title='清除并设默认值'
                 onClick={setDefaultHandle}></Button>}
                {/* 选项配置 JSON编辑 */}
                {
                    enableJsonEditor && <ButtonJsonEditor jsonObject={jsonObject || {}} height={height}
                    // handleJsonEditor = {handleJsonEditor}
                    className = {styles.optionJsonEditor} 
                    // openJsonEditor = {openJsonEditor} 
                    lint = {lint}
                    onChange = {jsonChange}
                     />
                }
                </div>
            </div>
            <div>{panel}</div>
        </div>
    )
}