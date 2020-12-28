import { Component } from 'react';
import classNames from 'classnames';
import styles from './Filter.less';
import { Button, Divider, Tab, Tabs, Tooltip,
    Callout, Card, Elevation, FormGroup, InputGroup, Tree, Icon, Intent,
    Classes, Position, Menu, MenuItem, Popover, TextArea, TagInput } from "@blueprintjs/core";
import {SpanIcon, SmallButton, ExIcon, ExEditableText } from '../../../../components/common';
import {Selection, Input, InputTextGroup, InputLabel, InputSlider} from '../../../../components/controls/Input';
import {isArray, isString, contain, cloneJson} from '../../../../utils/util';
import { getFilterValue } from '../../../../utils/filter';
import { I18_PARAMS } from '../../../../const/i18';
import BlankCreate from '../../../../components/BlankCreate';
import FieldSelect from '../../../../components/FieldSelect';
import ButtonJsonEditor from '../../../../components/controls/ButtonJsonEditor';

// 过滤项
export function FilterItem(props) {
   const {filter, styleHelper, layer, onChange} = props;
   const exp = filter[0];
   const key = filter[1];
   let value = getFilterValue(filter);
   return (
       <div className={styles.filterItem}>
           <div className="flex-vertical">
               <div>
                   <h6 title={key} className="text-overflow">
                        <Icon icon="key" /> {key}
                    </h6>
               </div>
               <div>
                   <span className={styles.expSpan}>{I18_PARAMS[`ex-${exp}`]}</span>
                   <Button minimal='true' small='true' icon="trash"
                       onClick={(e) => {
                           styleHelper.removeFilter({layerId: layer.id, key, exp});
                       }} title="删除" />
               </div>
           </div>
           {/* 非 has, !has 过滤值 */}
           {
               exp !== 'has' && exp !== '!has' && <div>
                   {
                    isArray(value) && <div>
                        <div><TagInput values={value} fill={true} onChange={
                            (values) => { onChange && onChange({exp, key, value:values}) }
                        } /></div>
                        <div style={{marginTop: '5px', fontSize: '12px'}}>* 输入时回车添加新值</div>
                        </div>
                   }
                   {
                       !isArray(value) && <Input fill={true} value={value} onChange={
                           (e) => { onChange && onChange({exp, key, value:e.target.value})
                        }} />
                   }
               </div>
           }
       </div>
   )
}

const FilterTypeOptions = ['all', 'any', 'none' ].map((op) => {
    return {
        label: I18_PARAMS[`ex-${op}`],
        value: op
    }
});

// 图层过滤面板
export class FilterPanel extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            showFieldSelect: false, // 字段选择面板显示
            fields: [], // 字段列表
        }
    }

    // 打开或关闭字段选择面板
    toggleShowFieldSelect  = ()=> {
        this.setState({showFieldSelect: !this.state.showFieldSelect});
    }


    addFilterHandle = ({name, exp, type}) => {
        const {layer, styleHelper} = this.props;
        if(layer && styleHelper && name && exp) {
            styleHelper.addFilter({layerId: layer.id, key: name, exp});
        }
    }

    /**
     * 更新过滤字段
     */
    updateFilter = ({key, exp, type, value}) => {
        if(!key || !exp ) return;
        const {layer, styleHelper} = this.props;
        styleHelper.updateFilter({layerId: layer.id, key, exp, value});
    }

    render() {
        const {showFieldSelect, fields} = this.state;
        const {layer, styleHelper} = this.props;
        if(!layer) return null;

        // 图层过滤参数
        const filter = styleHelper.getLayerFilterList(layer.id);

        // 图层过滤类型  all, any, none
        const filterType = filter[0];

        // 图层过滤列表
        const filterList = filter.filter(f => f!=='all' && f!=='none' && f!== 'any');
        
        // 过滤字段选择面板
        const selectFieldPanel = (<div className={styles.fieldWrapper}>
            {showFieldSelect &&<FieldSelect 
                showFilterTypeSelector={true} 
                onChange = {this.addFilterHandle}
                {...this.props}
            />}
        </div>);

        return (
            <div className={styles.filterPanel}>
                <div className={classNames('flex-vertical')}>
                    <div>
                        <Selection options={FilterTypeOptions} value={filterType} onChange={() => {}} />
                    </div>
                    <div>
                        <Popover content={selectFieldPanel} position='right-top' onOpening={() => {
                            this.setState({showFieldSelect: true})
                        }}>
                            <Button minimal='true' 
                                title="添加过滤"
                                small='true'
                                icon="add" 
                                />
                        </Popover>
                        <Button minimal='true' small='true' icon="trash" title='清除所有过滤' onClick={() => {
                            styleHelper.clearFilter({layerId: layer.id})
                        }} />
                        <ButtonJsonEditor height={400} icon={'&#xe62b;'} jsonObject={{filter:filter}} onChange={(e) => {}} />
                    </div>
                </div>
                <div>
                    <ul>
                        {
                            filterList.length > 0 && filterList.map((f, index) => {
                                return <li key={index} >
                                    <FilterItem filter={f} onChange={this.updateFilter} {...this.props}/>
                                </li>
                            })
                        }
                    </ul>
                    {
                        filterList.length === 0 && <BlankCreate desc='还没有设置过滤条件' className={styles.blankCreate} />
                    }
                </div>
            </div>
        );
    }
}