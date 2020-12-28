import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './Info.less';

export default function InfoPane(props) {
    const {info} = props;
    if(!info) return null;
    const {center, zoom , mouseLatLng, mouseClientPosition} = info;
    return (
        <p className={styles.info}>
            {mouseLatLng && <span>鼠标坐标：经度：{mouseLatLng[0].toFixed(5)}，纬度：{mouseLatLng[1].toFixed(5)}</span>}
            {mouseClientPosition && <span>鼠标屏幕位置：X：{mouseClientPosition.x}, Y：{mouseClientPosition.y}</span>}
            {center && <span>中心点坐标：经度：{center[0].toFixed(5)}，纬度：{center[1].toFixed(5)}</span>}
            {zoom !== undefined && <span>当前层级：{zoom.toFixed(2)}</span>}
        </p>
    )
}