import { Component } from 'react';
import classNames from 'classnames';
import styles from './Base.less';
import { Button } from "@blueprintjs/core";
import {ExEditableText} from '../../../../components/common';
import {ToasterWarning} from '../../../../components/Toaster';
import Collapse from '../../../../components/Collapse';
import * as OPTIONS from '../../../../const/options';
import { I18_PARAMS } from '../../../../const/i18';
import Option from '../../../../components/controls/Option';
import {Selection, InputSlider, EditableWithHandle} from '../../../../components/controls/Input';
import AddSourceModal from '../source/AddSource';
import {contain} from '../../../../utils/util';
import {getLayerTypeByGeometryType} from '../../../../utils/map';
import {VECTOR_LAYER_TYPES, LINE_TYPES, POINT_TYPES, POLYGON_TYPES} from '../../../../const/core';
import {ajax_get} from '../../../../utils/ajax';
// 
// getLayerTypeByGeometryType

export default class LayerBaseConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddSourceModal: false,
        }
    }

    titleOption = () => {
        const {layer, filterKey, styleHelper} = this.props;
        // 图层名称
        if('图层名称'.indexOf(filterKey) < 0 && 'name'.indexOf(filterKey) < 0) return null;
        const name = (layer.metadata && layer.metadata.name) || '未命名图层';
        return <Option title='图层名称' jsonObject = {{metadata: {name: name}}} panel={
            <EditableWithHandle value={name} onChange={(value) => {
                styleHelper.updateLayer({id: layer.id, name: value}, 'metadata')
            }} />
        }  />
    }

    sourceOption = () => {
        const {layer, filterKey} = this.props;
        if('数据源'.indexOf(filterKey) < 0 && 'source'.indexOf(filterKey) < 0) return null;
        const name = layer.source;
        const panel = <div>
            <p className='mgb-1'>{name || ''}</p>
            <Button intent='primary' onClick={() => { this.setState({showAddSourceModal: true}) }}>
                {name && '重新'}选择数据源
            </Button>
        </div>
        return <Option title='数据源' jsonObject={{source:  name}} panel={panel}  />
    }

    sourceLayerOption = () => {
        const {filterKey, layer, styleHelper} = this.props;
        const source = styleHelper.getSourceByLayerId(layer.id);
        if(!source || !source.type === 'vector' || !source.url || !layer["source-layer"]) return null;
        if('数据源图层'.indexOf(filterKey) < 0 && 'source-layer'.indexOf(filterKey) < 0) return null;
        const vectorSpec = styleHelper.getVectorSourceSepc(layer.source);
        const vectorLayers = (vectorSpec && vectorSpec.vector_layers)|| [];
        const sourceLayerId = layer["source-layer"];
        const options = vectorLayers.map((sl) => {
            return {
                value: sl.id,
                label: sl.id
            }
        });
        const panel = <Selection value={sourceLayerId} options={options} 
        onChange={(v) => {styleHelper.updateLayer({id:layer.id, "source-layer": v})}}  />

        return <Option jsonObject={{"source-layer": sourceLayerId}} title='数据源图层' panel={panel} />
    }

    typeOption = () => {
        const {layer, filterKey, styleHelper} = this.props;
        if('图层类型'.indexOf(filterKey) < 0 && 'type'.indexOf(filterKey) < 0) return null;
        let options = OPTIONS['layer']['type']['value'].split('|').map((op) => {
            return {
                value: op,
                label: I18_PARAMS[op] + ' - ' + op
            }
        });
        // 需要配置图层对应数据源规则
        const source = styleHelper.getSourceByLayerId(layer.id);
        if(!layer.source) {
            options = options.filter((o) => {return o.value === 'background'});
        }
        if(source) {
            if(source.type === 'vector') {
                let type = layer.type;
                const oldType = layer.metadata && layer.metadata.oldType;
                if(type === 'heatmap' && oldType) {
                    type = oldType;
                }
                if(contain(POINT_TYPES, type) >= 0) {
                    options = options.filter(o => contain(POINT_TYPES, o.value) >= 0);
                }
                if(contain(POLYGON_TYPES, type) >= 0) {
                    options = options.filter(o => contain(POLYGON_TYPES, o.value) >= 0);
                }
                if(contain(LINE_TYPES, type) >= 0) {
                    options = options.filter(o => contain(LINE_TYPES, o.value) >= 0);
                }
                if(type !== 'heatmap') {
                    options.push({value:'heatmap', label: '热力图 - heatmap'});
                }
            } else if(source.type === 'raster') {
                options = options.filter(o => o.value === 'raster');
            }
        }
        const panel = <Selection value={layer.type || options[0].value} options={options} onChange={
            (v) => {styleHelper.updateLayer({id: layer.id, type: v})}
        } />
        return <Option jsonObject={{type: layer.type}} title='图层类型' panel={panel} />
    }

    minZoomOption = () => {
        const {layer, filterKey, styleHelper} = this.props;
        if('最小层级'.indexOf(filterKey) < 0 && 'minzoom'.indexOf(filterKey) < 0) return null;
        const option = OPTIONS['layer'][ 'minzoom'];
        const value = layer['minzoom'];
        const maxzoom = layer['maxzoom'];
        const panel = <InputSlider labelStepSize={maxzoom || option.max}
                value={value || option.value} 
                onChange={(v) => { styleHelper.updateLayer({id: layer.id, minzoom: v}); }} 
                // showTrackFill = {false}
                min={option.min} 
                max={maxzoom || option.max} />;
       return <Option jsonObject={{minzoom: value || option.value}} 
        title={option.label} 
        panel={panel} 
        setDefaultHandle={() => {}} />;
    }

    maxZoomOption = () => {
        const {layer, filterKey, styleHelper} = this.props;
        if('最大层级'.indexOf(filterKey) < 0 && 'maxzoom'.indexOf(filterKey) < 0) return null;
        const option = OPTIONS['layer'][ 'maxzoom'];
        const value = layer['maxzoom'];
        const minzoom = layer['minzoom'] || 0;
        const panel = <InputSlider 
                // showTrackFill = {false}
                labelStepSize={option.max - minzoom}
                value={value || option.value} 
                onChange={(v) => { styleHelper.updateLayer({id: layer.id, maxzoom: v}); }} 
                min={minzoom || option.min} 
                max={option.max} />;
       return <Option jsonObject={{maxzoom: value || option.value}} 
        title={option.label} panel={panel} 
        setDefaultHandle={() => {}} />;
    }
    
    /**
     * 执行替换数据源
     */
    handlerSelected = (selected) => {
        if(!selected || selected.length !== 1 || !selected[0]) return;
        const {layer, styleHelper} = this.props;
        const {geometry, id, name, source, type, _source} = selected[0];
        const layerType =getLayerTypeByGeometryType(geometry);
        // 如果相同， 则不处理
        if(source === layer.source) {
            this.setState({showAddSourceModal: false});
            return;
        }
        let sourceId = source;
        // 栅格数据源
        if(geometry === 'raster') {
            // `ts/x/${source}/`
            styleHelper.replaceSource({
                layerId: layer.id,
                sourceId,
                layerType,
                source: type === 'public' ?　_source : {
                    type: 'raster',
                    url: `atlasdata://ts/x/${sourceId}/`,
                    tileSize: 256,
                }
            });
        } else {
            if(type === 'dataset') {
                sourceId = id;
            }
            const tileUrl =  `${source ? 'ts' : 'datasets'}/x/${sourceId}/`;
            ajax_get({url: tileUrl}).then((res) => {
                if(!res) {
                    ToasterWarning({message:`未能获取相应${type === 'dataset' ? '数据' : '服务'}集`});
                    return;
                }
                const vlayer = res && res.vector_layers && res.vector_layers[0];
                if(vlayer) {
                    styleHelper.replaceSource({
                        layerId: layer.id,
                        sourceId,
                        layerType,
                        sourceLayer: vlayer.id,
                        source: {
                            type: 'vector',
                            url: `atlasdata://${source ? 'ts' : 'datasets'}/x/${sourceId}/`
                        }
                    });
                }

            });
        }
        this.setState({showAddSourceModal: false});
    }

    render() {
        const {layer, styleHelper, filterKey} = this.props;
        if(!layer) return null;
        const {showAddSourceModal} = this.state;
        const source = styleHelper.getSourceByLayerId(layer.id);
        const type = layer.type;
        // const titleOption = this.titleOption();
        const sourceOption = type !== 'background' && this.sourceOption();
        const sourceLayerOption = source && source.type === 'vector' && this.sourceLayerOption();
        const typeOption = type !== 'background' && this.typeOption();
        const minZoomOption = type !== 'background' && this.minZoomOption();
        const maxZoomOption = type !== 'background' && this.maxZoomOption();
        // const showSourceModal = source
        return (
            <Collapse title='基本配置' icon={'&#xe62b;'} isOpen={true}>
                <div className={styles.optionsMain}>
                    {sourceOption}
                    {sourceLayerOption}
                    {typeOption}
                    {layer.source && minZoomOption}
                    {layer.source && maxZoomOption}
                </div>
                {type !== 'background' && showAddSourceModal && 
                    <AddSourceModal 
                    isOpen={showAddSourceModal}
                    mode = 'single'
                    handleOk = {this.handlerSelected}
                    handleClose={() => {this.setState({showAddSourceModal: false})}}
                    layer={layer}
                    />}
            </Collapse>
        )
    }
}