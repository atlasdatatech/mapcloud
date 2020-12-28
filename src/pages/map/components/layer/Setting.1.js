import { Component } from 'react';
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
                if(reqKey === 'text-field') {
                    disabled = !layer['layout'][reqKey];
                    break;
                } else if(!layer[type][reqKey]) {
                    disabled = true;
                    break;
                }
            } else {            
                const reqValues = reqKeys[1].split('*');
                if(reqKey === 'text-field') {
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
                error:'样式校验失败'
            },
        }
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

    render() {
        const { activeLayer, styleHelper } = this.props;
        if(!activeLayer) return null;
        const { filterKey, lint } = this.state;
        const layer = activeLayer;
        const showLayout = layer.layout && OPTIONS[hyphens2camel(layer.type)]['layout'];
        const showFilter = isVectorLayer(layer.type);
        const showPaint = layer.paint  && OPTIONS[hyphens2camel(layer.type)]['paint'];
        const isBackgroundLayer = layer.type === "background";
        const addOptions = this.generateAddOptions();
        const name = (layer.metadata && layer.metadata.name) || '未命名图层';
        return (
            <div className={classNames(styles.container, 'h100')}>
                <div className={styles.title}>
                    <EditableWithHandle value={name} onChange={(value) => {
                        styleHelper.updateLayer({id: layer.id, name: value}, 'metadata')
                    }} />
                </div>
                <div className={styles.filterSearch}>
                    <FilterInput filterKey={filterKey} onChange={(value) => {
                        this.setState({filterKey: value})
                    }} placeholder='筛选配置项' />
                </div>
                <ScrollWrapper className={styles.scroll}>

                    {/* 图层基本配置 */}
                    <Base layer={layer} filterKey={filterKey} {...this.props} />

                    {/* 图层过滤配置 */}
                    {
                        showFilter && 
                        <Collapse title='过滤' icon={'&#xe62b;'} isOpen={false}>
                            <FilterPanel filterKey={filterKey} layer={layer} {...this.props}  />
                        </Collapse>
                    }
                    

                    {/* 图层规则配置 */}
                    { showLayout  && <Collapse title='规则' icon={'&#xe62b;'} 
                        isOpen={false}>
                        <div className={styles.optionsMain}>
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
                        </div>
                    </Collapse>}

                    {/* 图层样式配置 */}
                    { showPaint && <Collapse title='样式' icon={'&#xe62b;'} 
                        isOpen={false}>
                        <div className={styles.optionsMain}>
                            <TypeOptions options={getLayerKeyOptions(layer, 'paint', filterKey, true)}
                            addOptions = {addOptions}
                            lint = {lint}
                            onChange={(e) => { 
                                var flag = styleHelper.updateLayer({id: layer.id, [e.key]: e.value}, 'paint');
                                if(flag === false) {
                                    ToasterWarning({message:'地图样式校验失败，请检查输入参数'});
                                }
                            }} />
                        </div>
                    </Collapse> }

                    {/* 图层JSON编辑器 */}
                    <Collapse title='JSON 编辑器' icon={'&#xe62b;'} isOpen={false}>
                        <JsonEditor jsonObject={layer} height={300} saveHandle = {this.codeOnChange} />
                    </Collapse>
                </ScrollWrapper>
            </div>
        )
    }
}