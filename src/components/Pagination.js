import { Component } from 'react';
import classNames from 'classnames';
import styles from './Pagination.less';
import Pagination from 'rc-pagination';

export default function (props) {
    const { 
        total, // 记录总条数
        onChange, // 页面变化, 返回第几页
        current, // 当前页数
        pageSize, // 每页数
    } = props;
    if(!total) return null;
    return (
        <div className={classNames(styles.main, 'at-pagenation')}>
            <Pagination
                onChange={onChange}
                current={current || 1}
                total={total || 1}
                pageSize = {pageSize || 10}
                showLessItems
                showTitle={false}
                />
        </div>
    )
}