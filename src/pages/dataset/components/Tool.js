import { Component } from 'react';
import classNames from 'classnames';
import styles from './Tool.less';
import { ButtonGroup, Button, Divider} from "@blueprintjs/core";
import {ExIcon} from '../../../components/common';

export default function ToolPane(props) {

    const drawPoint = () => {}
    const drawLine = () => {}
    const drawPolygon = () => {}
    const deleteSelect = () => {}
    const clear = () => {}
    const init = () => {}

    return (
        <ul className={styles.tool}>
            <li title="平移" onClick={init}><ExIcon icon='&#xe62b;' /></li>
            <li title="创建点元素" onClick={drawPoint}><ExIcon icon='&#xe62b;' /></li>
            <li title="创建线元素" onClick={drawLine}><ExIcon icon='&#xe62b;' /></li>
            <li title="创建面元素" onClick={drawPolygon}><ExIcon icon='&#xe62b;' /></li>
            <li title="清除选中" onClick={deleteSelect}><ExIcon icon='&#xe62b;' /></li>
            <li title="清空所有元素" onClick={clear}><ExIcon icon='&#xe62b;' /></li>
        </ul>
    )
}