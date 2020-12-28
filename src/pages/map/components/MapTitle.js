import { Component } from 'react';
import classNames from 'classnames';
import styles from './MapTitle.less';
import {ExEditableText} from '../../../components/common';
import {EditableWithHandle} from '../../../components/controls/Input';

/**
 * 地图标题
 */
export default (props) => {
    const {name, onChange} = props;
    return (
        <div className={classNames(styles.container, 'clearfix pd-1')}>
            <EditableWithHandle value={name} onChange={(e) => {onChange && onChange(e)}} />
        </div>
    )
}