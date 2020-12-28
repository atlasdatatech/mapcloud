import { Component } from 'react';
import classNames from 'classnames';
import styles from './Toolbar.less';
import { Icon, Button, ButtonGroup } from "@blueprintjs/core";
import {SpanIcon, SmallButton, ExIcon, ExEditableText} from '../../../components/common';

export function Toolbar(props) {
    const {onChange} = props;
    return (
        <ButtonGroup vertical={props.vertical || true}  className={styles.toolbar}>
            <Button icon="trash" title="清除" onClick={() => {
                onChange && onChange({type:'measure', handle: 'clear'});
             }} />
            <Button icon={<ExIcon icon="&#xe623;" />} title="测面" onClick={() => {
                onChange && onChange({type:'measure', handle: 'area'});
             }} />
            <Button icon={<ExIcon icon="&#xe651;"  />} title="测距" onClick={() => {
                onChange && onChange({type:'measure', handle: 'distance'});
             }} />
            <Button icon="camera" title="截图" onClick={() => {
                onChange && onChange({type:'thumbnail'});
             }} />
        </ButtonGroup>
    )
}

