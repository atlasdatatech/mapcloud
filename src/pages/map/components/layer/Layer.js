import { Component } from 'react';
import classNames from 'classnames';
import styles from './Layer.less';
import { ButtonGroup, Button, Divider} from "@blueprintjs/core";
import ScrollWrapper from '../../../../components/ScrollWrapper';
import LayerTree from './LayerTree';
import {FilterInput} from '../../../../components/controls/Input';
import {merge, guid} from '../../../../utils/util';
import {flashLayer} from '../../../../utils/animate';
import AddSourceModal from '../source/AddSource';
import {getLayerTypeByGeometryType, getId} from '../../../../utils/map';
import {ajax_get} from '../../../../utils/ajax';
import {ATLAS_EXT_PRE} from '../../../../const/core'

export default class LayerPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: null,
            filterKey: '',
            showAddLayer: false,
            hideBasemap: false,
        }
    }

    setTree = (tree) => {
        this.setState({tree});
    }

    copy = (id) => {
        const {activeLayer, styleHelper} = this.props;
        let layerId = id || activeLayer.id;
        if(layerId) {
            const newLayer = merge({}, styleHelper.getLayer(layerId));
            newLayer.id = getId('layer');
            if(newLayer.metadata && newLayer.metadata.name) {
                newLayer.metadata.name = newLayer.metadata.name + '(复制)';
            }
            styleHelper.addLayer(newLayer);
        }
    }

    delete = (id) => {
        const {activeLayer, styleHelper} = this.props;
        let layerId = id || activeLayer.id;
        if(layerId) {
            styleHelper.removeLayer(layerId);
        }
    }

    flash = (id) => {
        const {activeLayer, styleHelper} = this.props;
        let layerId = id || activeLayer.id;
        if(layerId && styleHelper.map) {
            const layer = styleHelper.getLayer(layerId);
            if(!layer) return;
            const oldVisiblity = layer.layout 
            && layer.layout.visibility;
            flashLayer({
                map: styleHelper.map,
                layer: layerId,
                property: 'visibility',
                type: 'layout',
                on: 'visible',
                off: 'none',
                interval: 200,
                times: 10,
                end: () => {
                    styleHelper.map.setLayoutProperty(
                        layerId, 'visibility', oldVisiblity || 'visible');
                }
            })
        }
    }

    getActiveLayerIsVisible = (id) => {
        const {activeLayer, styleHelper} = this.props;
        const layer = styleHelper.getLayer(id || (activeLayer && activeLayer.id));
        return layer && (
            (!layer.layout) || 
            (layer.layout && layer.layout.visibility === undefined) || 
            (layer.layout && layer.layout.visibility === 'visible'));
    }

    handlerAddSource = () => {
        this.setState({showAddLayer: true});
    }

    handlerAddLayer = (layers) => {
        const {styleHelper, activeLayer, selected} = this.props;
        const map = styleHelper.map;
        if(!map) return;
        const options = {
            beforeId: activeLayer && activeLayer.id
        };
        let groupId = null;
        const group = styleHelper.getLayer(selected);
        const isGroup = styleHelper.isGroup(selected);
        if(isGroup) {
            groupId = group && group.id;
            options.position = "inner";
        }
        if(!groupId) {
            groupId = activeLayer && activeLayer.metadata && activeLayer.metadata.group;
        }
        layers.reverse().forEach((layer) => {
            const layerType = getLayerTypeByGeometryType(layer.geometry);
            let sourceId = layer.source;
            // 添加栅格瓦片图层
            if(layerType === 'raster') {
                // 公共地图
                if(layer.type === 'public' && layer._source) {
                    sourceId = layer.id;
                    styleHelper.addSource(sourceId, layer._source);
                } else {
                    styleHelper.addSource(sourceId, {
                        type: 'raster',
                        url: `atlasdata://ts/x/${sourceId}/`,
                        tileSize: 256,
                    });
                }
                styleHelper.addLayer({
                    id: getId('layer'),
                    type: 'raster',
                    source: sourceId,
                    metadata: {
                        name: layer.name || sourceId,
                        group: groupId
                    }
                }, options);
            } else {
                if(layer.type === 'dataset') {
                    sourceId = layer.id;
                }
                styleHelper.addSource(sourceId, {
                    type: 'vector',
                    url: `atlasdata://${layer.source ? 'ts' : 'datasets'}/x/${sourceId}/`
                });
                if(!layer.source) {
                    // datasets/x/SAmeji3mR/
                    ajax_get({url:`datasets/x/${sourceId}/`}).then((json) => {
                        if(json && json.vector_layers && json.vector_layers.length === 1) {
                            styleHelper.addLayer({
                                id: getId('layer'),
                                type: layerType,
                                source: sourceId,
                                "source-layer": json.vector_layers[0].id,
                                metadata: {
                                    name: layer.name || layer.id,
                                    group: groupId
                                },
                                paint:{},
                                layout: {}
                            }, options);
                        }
                    });
                } else {
                    styleHelper.addLayer({
                        id: getId('layer'),
                        type: layerType,
                        source: sourceId,
                        "source-layer": layer.id,
                        metadata: {
                            name: layer.name || layer.id,
                            group: groupId
                        },
                        paint:{},
                        layout: {}
                    }, options);
                }
            }
        });
        this.setState({showAddLayer: false});
    }

    addBackgroundLayer = () => {
        const {styleHelper} = this.props;
        styleHelper.addLayer({
            id: getId('background'),
            type: 'background',
            metadata: {
                name: '背景图层',
            },
        }, {toBottom: true});
    }

    toggleDisabledBasemap = () => {
        const {styleHelper, style} = this.props;
        const hideBasemap = style.metadata && style.metadata.hideBasemapLayer;
        styleHelper.updateMetadata({
            hideBasemapLayer: !hideBasemap
        });
    }

    render() {
        const {tree, filterKey, showAddLayer} = this.state;
        const {styleHelper, style, activeLayer, selected, setSelected} = this.props;
        if(!style) return null;
        
        const hideBasemap = style.metadata && style.metadata.hideBasemapLayer;
        let layers = (style.layers || []).filter((layer) => {
            let name = (layer && layer.metadata && layer.metadata.name) || layer.id;
            return name.toLocaleLowerCase().indexOf(filterKey.toLocaleLowerCase()) >= 0;
        });
        if(hideBasemap) {
            layers = layers.filter((layer) => {
                return layer.id.indexOf('atlasdata-ex') >= 0 
                    || layer.id.indexOf('atlas-ex') >= 0
                    || layer.id.indexOf(ATLAS_EXT_PRE) >= 0
                    || layer.id.indexOf('atlasdata-group') >= 0
            });
        }

        const layersLenth = layers.filter(ly => ly.metadata && !ly.metadata.isGroup).length;

        const activeLayerIsVisible = this.getActiveLayerIsVisible();
        const activeLayerId = activeLayer && activeLayer.id;
        return (
            <div className={classNames(styles.main, 'h100')}>
                <div className={classNames(styles.head, 'flex-vertical')}>
                    <div>
                        <Button intent='primary' 
                            // small='true' 
                            icon="add" 
                            title='添加图层' 
                            text="添加图层"
                            onClick={this.handlerAddSource}
                            ></Button>
                        <Button small='true' 
                            icon="bold" 
                            minimal='true' 
                            title='添加纯色背景图层'
                            onClick={this.addBackgroundLayer}
                            />
                        <Button small='true' minimal='true'  icon="disable" title='隐藏或显示官方矢量底图图层（如有）' 
                            onClick={this.toggleDisabledBasemap}></Button>
                    </div>
                    <div>
                        <ButtonGroup minimal='true' >
                            {/* 删除或添加组, 如果选中的对象是组，显示删除组 */}
                            {/* <Button small='true' icon="group-objects" title='添加组'></Button> */}
                            {/* disable */}
                            
                            <Button small="true" icon="folder-new" title="添加组"
                            onClick={() => { styleHelper.addGroup({beforeId: selected})}}
                            />
                            <Button small='true' icon="duplicate" title='复制图层'  disabled = {!activeLayer} 
                            onClick={() => { this.copy(activeLayerId) }}></Button>
                            {/* <Button small='true' 
                                icon={activeLayerIsVisible ? 'eye-open' : 'eye-off'} 
                                title='隐藏图层'
                                disabled = {!activeLayer} 
                                onClick={() => {styleHelper.toggleLayerVisibility(activeLayerId)}}></Button> */}
                            {/* <Button small='true' icon="flash" title='闪烁图层' disabled = {!activeLayer} 
                                onClick={() => {this.flash(activeLayerId)}}></Button> */}
                            <Button small='true' icon="trash" title='删除图层或组' 
                                disabled = {!selected} 
                                onClick={() => {
                                    if(selected) {
                                        if(styleHelper.isLayer(selected)) {
                                            this.delete(selected)
                                        } else {
                                            styleHelper.removeGroup(selected, true);
                                        }
                                        setSelected(null);
                                    }
                            }}></Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className={classNames(styles.filter, 'flex-vertical')}>
                    <div>{layersLenth} 个图层</div>
                    <div>
                        <FilterInput filterKey={filterKey} onChange={(v) => this.setState({filterKey:v})}  />
                    </div>
                </div>
                <Divider />
                <ScrollWrapper className={styles.scroll}>
                    <LayerTree tree={tree} 
                        setTree={this.setTree} 
                        layers={layers} 
                        copyLayer = {this.copy}
                        deleteLayer = {this.delete}
                        {...this.props}      />
                </ScrollWrapper>
                {showAddLayer && <AddSourceModal 
                title='添加图层 - 选择数据源' 
                mode = 'multi'
                isOpen={this.state.showAddLayer} 
                handleOk = {this.handlerAddLayer}
                handleClose={() => {this.setState({showAddLayer:false})}} {...this.props}/>}
            </div>
        )
    }
}