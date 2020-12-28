import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './Setting.less';
import { EditableText, ButtonGroup, Button, Divider, Tab, Tabs, Tooltip,
    Callout, Card, Elevation, FormGroup, InputGroup, Tree, Icon, Intent,
    Classes, Position, Menu, MenuItem, Popover, Switch, TextArea } from "@blueprintjs/core";
import ScrollWrapper from '../../../../components/ScrollWrapper';
import {SpanIcon, SmallButton, ExIcon, ExEditableText} from '../../../../components/common';
import Collapse from '../../../../components/Collapse';
import * as OPTIONS from '../../../../const/options';
import { I18_PARAMS } from '../../../../const/i18';
import JsonEditor from '../../../../components/JsonEditor';
import {ToasterWarning} from '../../../../components/Toaster';
import {ButtonFieldSelect} from '../../../../components/ButtonFieldSelect';
import { TypeOptions} from '../../../../components/controls/ConfigOption';
import { hyphens2camel, contain } from '../../../../utils/util';
import {FilterInput, EditableWithHandle} from '../../../../components/controls/Input';
import { FilterPanel } from './Filter';
import Base from './Base';
import {ButtonIconSelector} from '../ButtonIconSelector';
import {isVectorLayer} from '../../../../utils/map';
import {getIcon} from '../../../../utils/icon';


/**
 * 每个参数选项是否可用
 * require 前置要求，说明： | 或， + 代表右侧是左侧的值, * 代表多个值
 * @param {Object} layer 图层信息
 * @param {String} key 属性字段
 * @param {String|Number|Obejct} value 属性值
 */
function getLayerOptionDisabeld(layer, type, key) {
    const layerType = hyphens2camel(layer.type);
    const KEY_PARAMS = OPTIONS[layerType][type][key];
    let disabled = false;
    if(!KEY_PARAMS || (!KEY_PARAMS['require'] && !KEY_PARAMS['disable'])) return disabled;
    if(!layer[type]) return true;
    // require 前置要求计算条件说明： | 或， + 代表右侧是左侧的值, * 代表多个值
    if(KEY_PARAMS['require']) {
        const requires = KEY_PARAMS['require'].split('|');
        for(let i = 0; i < requires.length; i++) {
            const req = requires[i];
            const reqKeys = req.split('+');
            const reqKey = reqKeys[0];
            if(reqKeys.length === 1) {
                if(reqKey === 'text-field' || reqKey === 'icon-image') {
                    disabled = !layer['layout'][reqKey];
                    break;
                } else if(!layer[type][reqKey]) {
                    disabled = true;
                    break;
                }
            } else {            
                const reqValues = reqKeys[1].split('*');
                if(reqKey === 'text-field' || reqKey === 'icon-image') {
                    disabled = !layer['layout'][reqKey];
                    break;
                } else if(!layer[type][reqKey] || contain(reqValues, layer[type][reqKey]) < 0) {
                    disabled = true;
                    break;
                }
            }
        }
    }
    // disable 如果对应的字段有值，则禁止
    if(KEY_PARAMS['disable']) {
        if(layer[type][KEY_PARAMS['disable']]) {
            disabled = true;
        }
    }
    return disabled;
}

/**
 * 获取图层选项参数
 * @param {Object} layer 图层
 * @param {String} filterKey 过滤参数
 * @param {String} type 图层主类, layout, paint
 */
function getLayerKeyOptions(layer, type, filterKey, enableJsonEditor){
    const layerType = hyphens2camel(layer.type);
    const keys = Object.keys(OPTIONS[layerType][type]);
    return keys.map((key) => {
        let value = layer[type][key];
        if(key === 'visibility') {
            // value = layer[type][key] === 'hidden' ? false : true;
        }
        return {
            targetKey: `${layerType}-${type}`,
            target: OPTIONS[layerType][type],
            _target: OPTIONS[layerType][type][key],
            key,
            value,
            disabled: getLayerOptionDisabeld(layer, type, key),
            enableJsonEditor: enableJsonEditor && key !== 'visibility'
        }
    }).filter(o => o._target && (o._target.label.indexOf(filterKey) >= 0 || o.key.indexOf(filterKey) >= 0));
}

export default class LayerSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterKey: '',
            lint:  {
                isValid: false,
                success:'样式校验正确', 
                error:'样式校验失败',
            },
            active: 'base',
            styleEditorHeight: 500
        };
        this.paneRef = React.createRef();
    }

    setFilterKey = (state) => {
        this.setState({filterKey: state});
    }

    setLint = (isValid) => {
        this.setState({
            lint: {
                isValid: isValid,
                success:'样式校验正确', 
                error:'样式校验失败'
            }
        })
    }

    codeOnChange = (layer) => {
        const {styleHelper} = this.props;
        if(!styleHelper) return;
        let flag = true;
        if(!layer || !layer.id) flag = false;
        flag = styleHelper.setLayer(layer);
        if(!flag) {
            ToasterWarning({message:'样式校验失败'});
        }
    }

    // 附加选项
    generateAddOptions = () => {
        const { styleHelper, mapId, activeLayer } = this.props;
        const addons = {};
        // 填充图片选择字段
        const patterns = [
            {fieldKey: 'icon-image', layerTarget: 'layout'},
            {fieldKey: 'background-pattern', layerTarget: 'paint'},
            {fieldKey: 'line-pattern', layerTarget: 'paint'},
            {fieldKey: 'fill-pattern', layerTarget: 'paint'},
            {fieldKey: 'fill-extrusion-pattern', layerTarget: 'paint'},
        ];
        patterns.forEach((pattern) => {
            const {layerTarget, fieldKey} = pattern;
            addons[fieldKey] = <ButtonIconSelector layerTarget={layerTarget} fieldKey={fieldKey} {...this.props} />
        });
        const fieldSelects = [
            {fieldKey: 'text-field', layerTarget: 'layout'},
        ];
        fieldSelects.forEach((select) => {
            const {layerTarget, fieldKey} = select;
            addons[fieldKey] = <ButtonFieldSelect layer={activeLayer} showFilterTypeSelector={false} layerTarget={layerTarget} fieldKey={fieldKey} {...this.props} />
        });
        return addons;
    }

    componentDidMount() {
        const paneRef = this.paneRef.current;
        if(paneRef) {
            const height = paneRef.clientHeight;
            this.setState({styleEditorHeight: height + 50});
        }
    }

    render() {
        const { activeLayer, styleHelper, handleTabChange } = this.props;
        if(!activeLayer) return null;
        const { filterKey, lint, styleEditorHeight } = this.state;
        const layer = activeLayer;
        const showLayout = layer.layout && OPTIONS[hyphens2camel(layer.type)]['layout'];
        const showFilter = isVectorLayer(layer.type);
        const showPaint = layer.paint  && OPTIONS[hyphens2camel(layer.type)]['paint'];
        const addOptions = this.generateAddOptions();
        const name = (layer.metadata && layer.metadata.name) || '未命名图层';
        const isBackgroundLayer = layer.type === 'background';
        let active = this.state.active;
        /* 图层基本配置 */
        const baseOptions = (<ScrollWrapper className={styles.scroll}><Base layer={layer} filterKey={filterKey} {...this.props} /></ScrollWrapper>);

        /* 过滤配置  */
        const filterOptions = (<ScrollWrapper className={styles.scroll}><FilterPanel filterKey={filterKey} layer={layer} {...this.props} /></ScrollWrapper>);

        // 规则配置
        const layoutOptions = (<ScrollWrapper className={styles.scroll}><div className={styles.optionsMain}>
            <TypeOptions 
            addOptions = {addOptions}
            options={getLayerKeyOptions(layer, 'layout', filterKey, true)}
            lint = {lint}
            onChange={(e) => { 
                // styleHelper.updateLayer({id: layer.id, [e.key]: e.value}, 'layout');
                var flag = styleHelper.updateLayer({id: layer.id, [e.key]: e.value}, 'layout');
                if(flag === false) {
                    ToasterWarning({message:'地图样式校验失败，请检查输入参数'});
                }
            }} />
        </div></ScrollWrapper>);


        const paintOptions = (<ScrollWrapper className={styles.scroll}> <div className={styles.optionsMain}>
            <TypeOptions options={getLayerKeyOptions(layer, 'paint', filterKey, true)}
            addOptions = {addOptions}
            lint = {lint}
            onChange={(e) => { 
                var flag = styleHelper.updateLayer({id: layer.id, [e.key]: e.value}, 'paint');
                if(flag === false) {
                    ToasterWarning({message:'地图样式校验失败，请检查输入参数'});
                }
            }} />
        </div></ScrollWrapper>);

        /**
         * 代码编辑
         */
        const codeOptions = (<JsonEditor jsonObject={layer} height={styleEditorHeight} saveHandle = {this.codeOnChange} />);

        if(isBackgroundLayer && active === "base") {
            active = "paint";
        }

        let tabContent = null;
        if(active === 'base') {
            tabContent = baseOptions;
        }
        if(active === 'filter') {
            tabContent = filterOptions;
        }
        if(active === 'layout') {
            tabContent = layoutOptions;
        }
        if(active === 'paint') {
            tabContent = paintOptions;
        }
        if(active === 'code') {
            tabContent = codeOptions;
        }
        
      

        return (
            <div className={classNames(styles.container, 'h100')}>
                <div className={styles.title}>
                    <div className="flex-vertical h100">
                        <div>
                            {getIcon({
                                type: layer.type, 
                                iconSize: 16, 
                                color: styleHelper.getLayerColor(layer.id),
                                title: `${I18_PARAMS[layer.type]} - ${name}`
                            })}
                        </div>
                        <div>
                            <EditableWithHandle value={name} onChange={(value) => {
                                styleHelper.updateLayer({id: layer.id, name: value}, 'metadata')
                            }} />
                        </div>
                    </div>
                </div>
                <div className={classNames(styles.tabs, 'clearfix')}>
                    <div className={styles.tabNav}>
                        <ul>
                            <li title="返回图层列表" 
                                onClick= {() => {handleTabChange && handleTabChange("list")}}>
                                <Icon icon="circle-arrow-left" iconSize={20} />
                            </li>
                            {!isBackgroundLayer && <li title="基本配置" 
                                onClick= {() => {this.setState({active: 'base'})}}
                                className={classNames(active === 'base' && styles.active)}>
                                <Icon icon="cog" iconSize={20} />
                            </li>}
                            {!isBackgroundLayer && <li title="过滤"
                                onClick= {() => {this.setState({active: 'filter'})}}
                                className={classNames(active === 'filter' && styles.active)}
                            ><Icon icon="filter" iconSize={20}  /></li>}
                            <li title="规则布局" 
                                onClick= {() => {this.setState({active: 'layout'})}}
                                className={classNames(active === 'layout' && styles.active)}
                            ><Icon icon="control" iconSize={20}  /></li>
                            <li title="样式"
                                onClick= {() => {this.setState({active: 'paint'})}}
                                className={classNames(active === 'paint' && styles.active)}
                            ><Icon icon="style" iconSize={20}  /></li>
                            <li title="代码"
                                onClick= {() => {this.setState({active: 'code'})}}
                                className={classNames(active === 'code' && styles.active)}
                            ><Icon icon="code" iconSize={20}  /></li>
                        </ul>
                    </div>
                    <div className={styles.tabsContent}>
                        {
                            !isBackgroundLayer && active !== 'code' && active !== 'filter' && <div className={styles.filterSearch}>
                            <FilterInput filterKey={filterKey} onChange={(value) => {
                                this.setState({filterKey: value})
                            }} placeholder='筛选配置项' />
                        </div>
                        }
                        <div ref={this.paneRef} className = {classNames(styles.tabContent, active === 'code' && styles.tabContentNoFilter)}>
                            {tabContent}
                        </div>
                </div>
                </div>
            </div>
        )
    }
}