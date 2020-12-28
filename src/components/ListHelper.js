import { Component } from 'react';
import classNames from 'classnames';
import styles from './ListHelper.less';
import {FilterInput, Selection, SearchInput} from './controls/Input';
import { ButtonGroup, Button } from "@blueprintjs/core";


export default function ListHelper(props) {
    const {
        searchKey, // 搜索关键字
        searchKeyOnChange,  // 搜索关键字变化
        searchHandler, // 搜索事件
        clearSearchKey, // 清空搜索事件

        filterKey,  // 过滤关键字
        filterKeyOnChange,  // 过滤关键字变化

        sortKey, // 排序字段关键字
        sortOptions, // 排序字段选项
        sortKeyOnChange, // 排序字段变化

        sortOrder, // 排序正反序关键字
        sortOrderChange, // 排序正反序事件
        updateHandler, // 列表刷新事件

        publicType, // 查看公开
        publicOnChange, 
    } = props;
    const publicOptions = [{label:'所有', value:'all'}, {label:'公开', value:'public'}, {label:'非公开', value:'private'}];
    return (
        <div className={classNames(styles.main, 'flex-vertical')}>
            {
                publicOnChange && 
                <div>
                    <Selection options={publicOptions} value={publicType} onChange={publicOnChange} />
                </div>
            }
            {searchHandler && <div>
                <SearchInput value={searchKey} 
                    onChange={searchKeyOnChange}
                    clearSearchKey = {clearSearchKey}
                    searchHandler = {searchHandler}
                />
            </div>}
            {
                // filterKeyOnChange && 
                // <div>
                //     <FilterInput filterKey={filterKey} onChange={filterKeyOnChange} />
                // </div>
            }
            {
                sortKeyOnChange && 
                <div>
                    <Selection options={sortOptions} value={sortKey} onChange={sortKeyOnChange} />
                </div>
            }
            <div>
                <ButtonGroup minimal={true}>
                    {
                        sortOrderChange &&
                        <Button onClick={sortOrderChange} 
                            title={sortOrder === 'desc' ? '倒序' : '正序'}
                            icon={sortOrder === 'desc' ? 'sort-desc' : 'sort-asc'}>
                        </Button>
                    }
                    {
                        updateHandler && 
                        <Button onClick={updateHandler} icon='refresh'  title='刷新列表'></Button>
                    }
                </ButtonGroup>
            </div>
        </div>
    )
}