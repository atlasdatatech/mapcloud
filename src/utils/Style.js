import {getObjectFromArray, removeObjectFromArray, isBoolean, guid,
    isEmptyObject, merge, replaceAll, swapArrItems, isString, contain, mixin, isObject,
    isValidNumber, moveInArray, formatNum, throttle, cloneJson, isArray, randomColor} from './util';
import * as log from 'loglevel';
import {ajax_get, getHost} from './ajax';
import {BLANK_STYLE} from '../const/core';
import {ToasterWarning} from '../components/Toaster';
import {validate, ValidationError} from '@mapbox/mapbox-gl-style-spec';
import {isVectorLayer} from './map';
// exports.v8 = v8;
// exports.latest = v8;
// exports.format = format;
// exports.migrate = migrate;
// exports.composite = composite;
// exports.diff = diffStyles;
// exports.ValidationError = ValidationError;
// exports.ParsingError = ParsingError$1;
// exports.expression = expression$1;
// exports.featureFilter = createFilter;
// exports.Color = Color;
// exports.function = styleFunction;
// exports.validate = initSuffixStyle$$1;
// exports.visit = visit;

export default class Style {
    constructor({style, map, syncEvent}) {
        this.style = style;
        this.map = map;
        this.sources = {};
        this.prefix = 'atlasdata://';
        this._setMapLayerLazy = throttle(({type, layerId, key, value}) => {
            const map = this.map;
            if(type && layerId && key && map && map[`set${type}Property`]) {
                map[`set${type}Property`](layerId, key, value);
            }
        }, 200);
        this.syncEvent = syncEvent;
    }

    // style初始化
    initInspect = () => {
        if(window.atlas) {
            this.inspectorPopup =  new atlas.Popup({className:'atlas-popup-a'});
            const {map} = this;
            if(map) {
                map.on('mousemove', (e) => {
                    const measureTool = this.measureTool;
                    if(!measureTool || !measureTool.isMeasuring) {
                        this.inspectFeature(e);
                    }
                });
                map.on('click', (e) => {
                    const measureTool = this.measureTool;
                    if(!measureTool || !measureTool.isMeasuring) {
                        this.showFeatureInfo(e);
                    }
                })
            }
        }
    }

    // 校验样式
    validateStyleBySpec(style) {
        const errors = validate(style);
        if(errors&& errors.length > 0 ){
            console.error && console.error("AtlasMap 样式校验失败：" +  errors.toString())
            return false;
        }
        return true;
    }

    /**
     * 添加组
     * @param {String} name 
     * @param {String} beforeId
     * @param {Array<String>} layers 
     */
    addGroup({id, name, beforeId}) {
        if(id && this.getLayer(id, true)) return;
        const layers = this.style.layers;
        const group = layers.filter(ly => ly.metadata && ly.metadata.isGroup);
        id = id || `atlasdata-group-${guid(true)}`;
        if(!name) {
            let lastNameIndex = group.map(ly => ly.metadata && ly.metadata.name)
                .filter(d => /^组\d+$/.test(d))
                .map(d => parseInt(d.split("组")[1]))
                .sort((a, b) => b - a)[0];
            if(!lastNameIndex) {
                lastNameIndex = 0;
            }
            lastNameIndex++;
            name =  `组${lastNameIndex}`
        }
        layers.push({
            id,
            type: 'background',
            metadata: {
                isGroup: true,
                name,
                visibility: "visible",
                isExpanded: true,
            },
            paint: {
                "background-color": "rgba(0,0,0,0)"
            },
            layout: {
                visibility: 'none'
            }
        });
        if(beforeId) {
            this._moveLayer(id, beforeId);
        }
        this.update();
    }

    // 获取组图层
    getGroupLayers = (id) => {
        return this.style.layers.filter(ly => ly.metadata && ly.metadata.group === id);
    }

    /**
     * 移除组
     * @param {*} id 
     */
    removeGroup = (id, removeLayer) => {
        const group = this.getLayer(id);
        const { layers } = this.style;
        if(group) {
            removeObjectFromArray(layers, 'id', id);
        }
        layers.forEach(ly => {
            if(ly.metadata && ly.metadata.group === id) {
                if(removeLayer) {
                    this.removeLayer(ly.id);
                }
                delete ly.metadata.group;
            }
        });
        const _layers = layers.filter(ly => ly.metadata && ly.metadata.group === id);
        if(_layers.length > 0) {
            this.removeGroup(id, removeLayer);
        } else {
            this.update();
        }
    }

    updateGroup(id, options) {
        if(!options) return;
        const group = this.getLayer(id, true);
        if(group) {
            for(const key in options) {
                group.metadata[key] = options[key];
            }
            this.update();
        }
    }

    getLayerIndex = (id) => {
        return getObjectFromArray(this.style.layers, 'id', id, true);
    }

    /**
     * 移动图层或组
     * 组可以移动到组前、组后、图层前、图层后，且目标层不位于某个组内
     * 组移动时同时需要更新组内图层的顺序
     * 图层可以移动组前、组后、图层前、图层后
     * @param {String} id 图层或组ID
     * @param {String} type 图层或组
     * @param {String} beforeOrAfter 移动方向, before, inner, after
     */
    move = ({sourceId, targetId, position}) => {
        if(!sourceId || !targetId) return;
        position = position || "before";
        let source = this.getLayer(sourceId, true);
        let target = this.getLayer(targetId, true);
        if(!source || !target) return;
        let sourceType = source.metadata && source.metadata.isGroup ? "group" : "layer";
        let targetType = target.metadata && target.metadata.isGroup ? "group" : "layer";

        // 调整依赖SourceID的组
        const layers = this.style.layers;
        const group = this.style.metadata.group;
        let beforeId = null;
        // 获取目标节点信息
        let targetBefore = this.getGroupBefore(targetId);
        let sourceBefore = this.getGroupBefore(sourceId);
        if(sourceType === 'layer') {
            if(!source.metadata) source.metadata = {};

            // 移动到组中、组前、组后
            if(targetType === "group") {
                // 图层移动到组前
                if(position === 'before') {
                    delete source.metadata.group;
                    const lastLayer = this.getGroupFirstLayer(targetId);
                    beforeId = (lastLayer && lastLayer.id) || targetId;
                }
                // 图层移动到组后
                if(position === 'after') {
                    delete source.metadata.group;
                    beforeId = targetBefore;
                }
                // 图层移动到组内
                if(position === "inner") {
                    source.metadata.group = targetId;
                    beforeId = targetId;
                }
            }
            
            // 目标对象为图层，操作包括before、after
            if(targetType === 'layer') {
                let targetGroup = target.metadata && target.metadata.group;
                if(targetGroup) {
                    source.metadata.group = targetGroup;
                } else {
                    delete source.metadata['group'];
                }
                if(position === 'before') {
                    beforeId = targetId;
                }
                if(position === 'after') {
                    beforeId = targetBefore;
                }
                
            }
            this._moveLayer(sourceId, beforeId);
        }
        // 如果是组移动
        if(sourceType === 'group') {
            const sourceGroupLayers = this.getGroupLayers(sourceId);
            const sourceGroupHasLayer = sourceGroupLayers.length > 0;
            // 如果目标是组
            if(targetType === "group") {
                const targetGroupLayers = this.getGroupLayers(targetId);
                const targetGroupHasLayer = targetGroupLayers.length > 0;
                // 如果在目标组前置
                if(position === "before") {
                    // 目标组是否有图层
                    if(targetGroupHasLayer) {
                        const layer = this.getGroupFirstLayer(targetId);
                        beforeId = layer && layer.id;
                    } else {
                        beforeId = targetId;
                    }
                }
                if(position === "after") {
                    beforeId = targetBefore;
                }
            }  
            if(targetType === "layer") {
                if(position === 'before') {
                    beforeId = targetId;
                }
                if(position === 'after') {
                    beforeId = targetBefore;
                }
            }
            this._moveLayer(sourceId, beforeId);
            if(sourceGroupHasLayer) {
                beforeId = sourceId;
                for(let i = sourceGroupLayers.length - 1; i >= 0 ; i--) {
                    const ly = sourceGroupLayers[i];
                    this._moveLayer(ly.id, beforeId);
                    beforeId = ly.id;
                }
            }
        }

        this.update();
        
        // console.log(
        //     source.metadata.name, 
        //     " --> ", 
        //     target.metadata.name,
        //     ",", 
        //     position
        // );
    }

    isLayer = (id) => {
        const layer = this.getLayer(id)    ;
        return layer && layer.metadata && !layer.metadata.isGroup;
    }

    isGroup = (id) => {
        const layer = this.getLayer(id)    ;
        return layer && layer.metadata && layer.metadata.isGroup;
    }

    getGroupBefore = (id) => {
        if(!id) return;
        let targetIndex = this.getLayerIndex(id);
        if(!targetIndex < 0) return;
        // let targetType = target.metadata && target.metadata.isGroup ? "group" : "layer";
        const beforeLayer = this.style.layers[targetIndex + 1];
        return beforeLayer && beforeLayer.id;
    }

    _moveLayer = (sourceId, beforeId) => {
        if(!sourceId) return;
        const layers = this.style.layers;
        let sourceIndex = this.getLayerIndex(sourceId);
        let beforeIndex = beforeId ? this.getLayerIndex(beforeId) : (layers.length - 1);
        if(sourceIndex < 0 || beforeIndex < 0) return;
        if(beforeId && sourceIndex < beforeIndex) {
            beforeIndex -= 1;
        }
        if(!beforeId && beforeIndex === layers.length - 1) {
            beforeIndex = layers.length - 1;
        }
        moveInArray(layers, sourceIndex, beforeIndex);
        const map = this.map;
        const sourceLayer = map.getLayer(sourceId);
        if(map && sourceLayer) {
            if(beforeId && map.getLayer(beforeId)) {
                map.moveLayer(sourceId, beforeId);
            } else {
                map.removeLayer(sourceId);
                map.addLayer(sourceLayer.serialize());
            }
        }
        
    }

    /**
     * 更新图层附加信息
     */
    updateLayerMetadata = (layerId, metadata) => {
        if(layerId && !isEmptyObject(metadata)) {
            this.style.layers.forEach((ly) => {
                if(ly.id === layerId) {
                    if(!ly.metadata) ly.metadata = {};
                    for(const key in metadata) {
                        ly.metadata[key] = metadata[key];
                    }
                    return;
                }
            });
            this.update();
        }
    }

    /**
     * 获取图层附加信息
     */
    getLayerMetadata = (layerId, key) => {
        const layer = this.getLayer(layerId);
        if(!layer) return null;
        if(key === undefined) return cloneJson(layer.metadata);
        if(!key || !layer.metadata) return null;
        return layer.metadata[key];
    }

    /**
     * 更新附加信息
     */
    updateMetadata = (option) => {
        if(!isEmptyObject(option)) {
            for(const key in option) {
                this.style.metadata[key] = option[key];
            }
            this.update();
        }
    }

    // 检查style并打补丁
    initSuffixStyle() {
        const {style} = this;
        if(!style.layers || isEmptyObject(style.layers))  style.layers = [];
        if(!style.version)  style.version = 8;
        if(!style.sources) style.sources = {};
        if(!style.metadata) style.metadata = {};
        if(!style.glyphs) style.glyphs = "atlasdata://fonts/{fontstack}/{range}.pbf";
        if(style.metadata.hideBasemapLayer === undefined) {
            style.metadata.hideBasemapLayer = true;
        }
        style.layers.forEach((layer) => {
            // 校正过滤器
            const filter = layer.filter;
            if(isVectorLayer(layer.type)) {
                if(!filter || isEmptyObject(filter) || !isArray(filter) 
                    || (isArray(filter) && filter.length === 0)) {
                    layer.filter = ['all'];
                } else if(isArray(filter)){
                    let filterType = filter[0];
                    if(filterType && isString(filter[0])) {
                        if(contain(['all', 'none', 'any'], filterType) < 0) {
                            filterType = 'all';
                            layer.filter = [layer.filter];
                        }
                    }
                    if(isArray(layer.filter[0])) {
                        layer.filter.unshift('all');
                    }
                }
            }
            if(!layer.metadata) {
                layer.metadata = {
                    name: layer.id
                }
            }
            if(!layer.layout) {
                layer.layout = {
                    visibility: 'visible'
                };
            }
            if(layer.layout.visibility === undefined) {
                layer.visibility = 'visible';
            }
            if(!layer.paint) {
                layout.paint = {};
            }
        });
        for(const key in style.sources) {
            const source = style.sources[key];
            if(source && source.type === 'vector' && source.url) {
                this.addVectorSourceSpec(key);
            }
        }
    }

    getStyleByMap = () => {
        let style = cloneJson(this.style);
        style.layers.forEach(layer => {
            if(layer.filter && layer.filter.length === 0) {
                delete layer.filter;
            }
        });
        // 将服务器地址替换为所有 atlasdata://
        const styleForMap = JSON.parse(replaceAll(JSON.stringify(style), getHost(), 'atlasdata://' ));
        return styleForMap;
    }

    getStyle = () => {
        return cloneJson(this.style);
    }

    /**
     * 根据图层ID获取SOURCE源
     */
    getSourceByLayerId = (layerId) => {
        const layer = this.getLayer(layerId);
        if(!layer) return null;
        return this.getSource(layer.source);
    }

    getSourceDetail = (layerId) => {
        const layer = this.getLayer(layerId);
        if(!layer && this.sources[layer.source]) return null;
        return cloneJson(this.sources[layer.source]);
    }

    _setCenterByLayer = (source) => {
        if(!source) return;
        const {center, bound} = source;
        const map = this.map;
        if(!map) return;
        if(bound && bound.length === 4) {
            map.fitBounds([[bound[0], bound[1]], [bound[2], bound[3]]]);
        } else if(center && center.length >= 2) {
            map.setCenter(center.slice(0, 2));
            if(center[2]) {
                map.setZoom(center[2]);
            }
        }
        if(!source) return;
    }

    setCenterByLayer = (layerId) => {
        const layer = this.getLayer(layerId);
        if(!layer) return;
        const source = this.getSourceDetail(layerId);
        if(!source) {
            this.addVectorSourceSpec(layer.source, (s) => {
                this._setCenterByLayer(s);
            })
        } else {
            this._setCenterByLayer(source);
        }
        
    }

    getName = () => {
        const {style} = this;
        return style && style.name;
    }

    setName = (name) => {
        const {style} = this;
        if(style)  {
            style.name = name;
        }
    }

    setStyle(style, options) {
        options = options || {};
        try {
            this.style = JSON.parse(replaceAll(JSON.stringify(style), getHost(), 'atlasdata://' ));
        } catch {
            this.style = style;
        }
        this.initSuffixStyle();
        if(options.type === 'clone') {
            this.initBasemapGroup();
        }
        if(this.map) {
            const styleFoMap = this.getStyleByMap();
            this.map.setStyle(styleFoMap);
        }
        this.update();
    }

    initBasemapGroup() {
        let basemapLayers = this.style.layers.filter(ly => ly.id.indexOf("atlasdata") < 0);
        if(basemapLayers.length === 0) return;
        const id = "atlasdata-group-clone-basemap";
        const group = this.getLayer(id);
        if(!group) {
            this.addGroup({id, name: '底图'});
        }
        this.style.layers.forEach(ly => {
            if(ly.id !== id && ly.id.indexOf("atlasdata") < 0) {
                if(!ly.metadata) ly.metadata = {};
                ly.metadata.group = id;
            }
        });
    }

    getMap = () => {
        return this.map;
    }

    setMap = (map) => {
        this.map = map;
    }

    // 更新
    update = () => {
        if(this.syncEvent) {
            this.syncEvent(this.getStyle());
        }
        return true;
    }

    getLayers = () => {
        const {style} = this;
        return (style && style.layers) || [];
    }

    getSources = () => {
        const {style} = this;
        return style && style.sources;
    }

    /**
     * 获取源
     * @param {Object} style 样式文件
     * @param {String} layerId 图层ID
     * @return {Object} layer 图层
     */
    getLayer = (layerId, ref) => {
        const style = this.style;
        if(!layerId || !style || !style.layers || style.layers.length === 0 ) return null;
        const layer = getObjectFromArray(style.layers, 'id', layerId);
        return layer ? (ref ? layer : cloneJson(layer)) : null;
    }

    // 移除图层
    removeLayer = (layerId) => {
        const style = this.style;
        const map = this.map;
        const layer = this.getLayer(layerId);
        if(layer) {
            if(map && map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            removeObjectFromArray(style.layers, 'id', layerId);
            this.update();

            const source = layer.source;
            if(source) {
                const sourceIsInLayers = this.isSourceIsInUse(source);
                if(!sourceIsInLayers) {
                    this.removeSource(source);
                }
            }
            
            
        }
    }

    isSourceIsInUse = (source) => {
        const style = this.style;
        let isIn = false;
        if(!style || !source)return isIn;
        const layers = style.layers;
        if(!layers || layers.length === 0) return isIn;
        layers.forEach((layer) => {
            if(layer && layer.source === source) {
                isIn = true;
                return;
            }
        });
        return isIn;
    }

    updateSprite = ({mapId}) => {
        const style = this.style;
        style.sprite = `${this.prefix}maps/x/${mapId}/sprite`;
    }

    /**
     * 更新地图ICON
     */
    updateImages = (updateImages) => {
        if(isEmptyObject(updateImages) || !this.map) return;
        const map = this.map;
        const im = map.style.imageManager;
        for(const key in im.images) {
            map.removeImage(key);
        }
        for(const key in updateImages) {
            map.addImage(key, updateImages[key].data);
        }
    }

    _updateMapValidate = (option, target) => {
        if(!option) return false;
        const style = cloneJson(this.style);
        if(!target) {
            for(const key in option) {
                style[key] = option[key];
            }
        } else {
            if(!style[target]) style[target] = {};
            for(const key in option) {
                style[target][key] = option[key];
            }
        }
        return this.validateStyleBySpec(style);
    }

    _getSourceField = ({type, id, layerId}) => {
        const sources = this.sources;
        const source = type === 'tileset' ? sources[id] : sources[id + '-dataset-info'];
        if(!source) return [];
        // console.log(type, id, layerId, source)
        if(type === 'tileset') {
        if(source.tilestats) {
                const layer = source.tilestats.layers.filter(ly => ly.layer === layerId)[0];
                return (layer && layer.attributes.map((attr) => {
                    return {
                        name: attr.attribute,
                        type: attr.type
                    }
                })) || [];
            } else if(source.vector_layers) {
                const layer = source.vector_layers.filter(ly => ly.id === layerId)[0];
                if(!layer || !layer.fields) return [];
                const fields = Object.keys(layer.fields);
                return fields.map((f) => {
                    return {
                        name: f,
                        type: layer.fields[f],
                    }
                });
            }
        } else if(type === 'dataset') {
            return (source.fields ||[]).map(f => {
                return {
                    name: f.name,
                    type: f.type
                }
            });
        }
        return [];
    }

    getSourceType = (sourceId) => {
       const source = this.getSource(sourceId);
       if(!sourceId || !source) return null;
       if(source.url.indexOf('/ts/x/') > 0) return 'tileset';
       if(source.url.indexOf('/datasets/x/') > 0) return 'dataset';
       return null;
    }

    fetchSourceFieldsByLayer = (layerId) => {
        return new Promise((resolve, reject) => {
            const layer = this.getLayer(layerId);
            if(!layerId || !layer || !isVectorLayer(layer.type)) resolve([]);
            
            const id = layer.source;
            const sources = this.sources;
            const type = this.getSourceType(id);
            if((type === 'tileset' && sources[id]) ||
                (type === 'dataset' && sources[id + '-dataset-info'])
            ) {
                resolve(this._getSourceField({type, id, layerId: layer['source-layer']}));
            } else {
                const url = type === 'tileset' ? `ts/x/${id}/` 
                    : `datasets/info/${id}/`;
                ajax_get({url}).then((res) => {
                    if(res) {
                        if(type === 'tileset') {
                            this.sources[id] = res;
                        } else if(res.code === 200) {
                            this.sources[id + '-dataset-info'] = res.data;
                        } else if(res.code !== 200 && res.msg) {
                            reject(res.msg);
                        }
                        resolve(this._getSourceField({type, id, layerId: layer['source-layer']}));
                    } else {
                        reject(res.msg);
                    }
                })
            }
        });
    }

    updateMap = (option, target) => {
        if(!option || !this._updateMapValidate(option, target)) return false;
        const {map, style} = this;
        if(!target) {
            for(const key in option) {
                style[key] = option[key];
                if(map) {
                    if(key === 'center') {
                        map.setCenter(option.center);
                    }
                    if(key === "zoom") {
                        map.setZoom(option.zoom);
                    }
                    if(key === "pitch") {
                        map.setPitch(option.pitch);
                    }
                    if(key === "bearing") {
                        map.setBearing(option.bearing);
                    }
                }
            }
        } else {
            if(!style[target]) style[target] = {};
            for(const key in option) {
                style[target][key] = option[key];
            }
            if(map) {
                if(target === 'light') {
                    map.setLight(style[target]);
                }
            }
        }
        return this.update();
    }

    validateLayer = (layer, target) => {
        if(!layer || !layer.id) return null;
        const _layer = this.getLayer(layer.id);
        const style = JSON.parse(JSON.stringify(this.style));
        if(_layer) {
            for(let i = 0, len = style.layers.length; i <= len; i++) {
                if(layer.id === style.layers[i].id) {
                    if(!target) {
                        for(const key in layer) {
                            if(key !== 'id') {
                                const oldValue = style.layers[i][key];
                                style.layers[i][key] = layer[key];
                                if((key === 'source-layer' || key === 'type') && oldValue !== layer[key]) {
                                    style.layers[i].layout = {};
                                    style.layers[i].paint = {};
                                }
                            }
                        }
                    } else {
                        for(const key in layer) {
                            if(style.layers[i][target] && key !== 'id') {
                                let v = null;
                                
                                switch(key) {
                                    case "visibility":
                                        v = layer[key] ? 'visible' : 'none';
                                        break;
                                    default:
                                        v = layer[key];
                                        break;
                                }
                                style.layers[i][target][key] = v;
                                let _type = '';
                                if(target === 'paint') _type = 'Paint';
                                if(target === 'layout') _type = 'Layout';
                            }
                        }
                    }
                    break;
                }
            }
        }
        return this.validateStyleBySpec(style);
    }

    /**
     * 删除过滤项
     */
    removeFilter = ({layerId, exp, key}) => {
        if(!layerId || !exp || !key) return;
        const layers = this.style.layers;
        for(let i = 0; i < layers.length; i++ ) {
            const layer = layers[i];
            if(layer.id === layerId && layer.filter) {
                layers[i].filter = layer.filter.filter((f) => {
                    return isString(f) || (isArray(f) && ((f[0] + f[1]) !== (exp + key)));
                });
                const map = this.map;
                if(map) {
                    map.setFilter(layer.id, layers[i].filter);
                }
                break;
            }
        }
        this.update();
    }

    /**
     * 是否包括过滤项
     */
    hasFilter = ({layerId, exp, key}) => {
        const layer = this.getLayer(layerId);
        if(!layerId || !layer || !exp || !key || !layer.filter || !isArray(layer.filter)) return false;
        return layer.filter.filter(f => (isArray(f) && (f[0] + f[1]) === (exp + key))).length > 0;
    }

    /**
     * 添加新的过滤项
     */
    addFilter = ({layerId, exp, key}) => {
        if(!layerId || !exp || !key) return;
        const layers = this.style.layers;
        if(this.hasFilter({layerId, exp, key})) return false;
        for(let i = 0; i < layers.length; i++ ) {
            const layer = layers[i];
            if(layer.id === layerId && layer.filter) {
                if(contain(['has', '!has'], exp) >= 0) {
                    layers[i].filter.push([exp, key]);
                }
                if(contain(['>=', '<=', '<', '>'], exp) >= 0) {
                    layers[i].filter.push([exp, key, 0]);
                }
                if(contain(['==', '!=', 'in', '!in'], exp) >= 0) {
                    layers[i].filter.push([exp, key, '']);
                }
                const map = this.map;
                if(map) {
                    map.setFilter(layer.id, layers[i].filter);
                }
                break;
            }
        }
        this.update();
    }

    /**
     * 清除过滤器
     */
    clearFilter = ({layerId}) => {
        const layer = this.getLayer(layerId);
        if(layer) {
            layer.filter = ['all'];
        }
        const map = this.map;
        if(map) {
            map.setFilter(layer.id, layer.filter);
        }
        this.update();
    }

    /**
     * 更新过滤条件
     */
    updateFilter = ({layerId, exp, key, value}) => {
        if(!layerId || !exp || !key) return;
        const layers = this.style.layers;
        for(let i = 0; i < layers.length; i++ ) {
            const layer = layers[i];
            if(layer.id === layerId) {
                const filter = layer.filter;
                if(isArray(filter)) {
                    for(let j = 0; j < filter.length; j++) {
                        const ft = filter[j];
                        if(ft && ft[0] === exp && ft[1] === key) {
                            // !has, has 无需更新，只有添加、删除
                            if(contain(['in', '!in'], exp) >= 0) {
                                if(!isArray(value)) {
                                    value = [value];
                                }
                                const formatValue = value.map((v) => {
                                    return isValidNumber(v) ? Number(v) : v;
                                });
                                filter[j] = [exp, key, ...formatValue];
                            } else if(contain(['!=', '==', '>', '>=', '<', '<='], exp) >= 0) {
                                if(!isArray(value)) {
                                    filter[j] = [exp, key, value];
                                }
                            }
                        }
                    }
                }
            }
        }
        const map = this.map;
        const layer = this.getLayer(layerId);
        if(map && layer) {
            map.setFilter(layer.id, layer.filter);
        }
        this.update();
    }

    getLayerFilterList = (layerId) => {
        const layer = this.getLayer(layerId);
        if(!layer || !layer.filter) return ['all'];
        let filter = cloneJson(layer.filter);
        let filterType = filter[0];
        if(filterType && isString(filter[0])) {
            if(contain(['all', 'none', 'any'], filterType) < 0) {
                filterType = 'all';
                filter = [filter];
            }
        }
        if(!filter) return ['all'];
        if(isArray(filter[0])) {
            filter.unshift('all');
        }
        return filter;
    }

    // 更新图层
    updateLayer = (layer, target) => {
        if(!layer || !layer.id) return null;
        // if(!this.validateLayer(layer, target)) return false;]
        const _layer = this.getLayer(layer.id);
        const style = this.style;
        if(_layer) {
            const map = this.map;
            for(let i = 0, len = style.layers.length; i <= len; i++) {
                if(layer.id === style.layers[i].id) {
                    if(!target) {
                        for(const key in layer) {
                            if(key && key !== 'id') {
                                const oldValue = style.layers[i][key];
                                style.layers[i][key] = layer[key];
                                if((key === 'source-layer' || key === 'type') && oldValue !== layer[key]) {
                                    if(map) map.removeLayer(layer.id);
                                    style.layers[i].layout = {};
                                    style.layers[i].paint = {};
                                    if(map) { map.addLayer(style.layers[i]); }
                                    if(key === 'type') {
                                        this.updateLayerMetadata(layer.id, {oldType: oldValue});
                                    }
                                }
                                if(map) {
                                    if(key === 'minzoom') {
                                        map.setLayerZoomRange(layer.id, layer[key], layer['maxzoom']);
                                    }
                                    if(key === 'maxzoom') {
                                        map.setLayerZoomRange(layer.id, layer['minzoom'], layer[key]);
                                    }
                                }
                            }
                        }
                    } else {
                        for(const key in layer) {
                            if(style.layers[i][target] && key && key !== 'id') {
                                let v = null;
                                // 特殊处理字段
                                switch(key) {
                                    case "visibility":
                                        if(isBoolean(layer[key])) {
                                            v = layer[key]  ? 'visible' : 'none';
                                        } else if(isString(layer[key])) {
                                            v = layer[key];
                                        }
                                        break;
                                    case "line-dasharray":
                                        // v =   ? 'visible' : 'none';
                                        let dasharray = layer[key];
                                        if(isArray(dasharray) && dasharray.length === 2) {
                                            v = dasharray[0] === 0 && dasharray[1] === 0 ? '' : dasharray;
                                        } else if(!isArray(dasharray) && isObject(dasharray) && !isEmptyObject(dasharray)) {
                                            v = dasharray;
                                        } else {
                                            v = '';
                                        }
                                        break;
                                    default:
                                        v = layer[key];
                                        break;
                                }
                                if(v === '' && target !== 'metadata') {
                                    delete style.layers[i][target][key];
                                } else {
                                    style.layers[i][target][key] = v;
                                }
                                let _type = '';
                                if(target === 'paint') _type = 'Paint';
                                if(target === 'layout') _type = 'Layout';
                                // this._setMapLayerLazy({
                                //     type: _type,
                                //     layerId: style.layers[i].id,
                                //     key,
                                //     value: v
                                // });
                                if(map && _type && map[`set${_type}Property`]) {
                                    // fill-extrusion-pattern
                                    if(key.indexOf("pattern") > 0) {
                                        map[`set${_type}Property`](style.layers[i].id, key, '');
                                    }
                                    map[`set${_type}Property`](style.layers[i].id, key, v === '' ? null : v);
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        return this.update();
    }

    /**
     * 切换组可见性
     */
    toggleGroupVisibility = (id) => {
        if(!id) return;
        const group = this.getLayer(id);
        if(!group) return;
        const visibility = group.metadata.visibility === 'none' ? 'visible' : 'none';
        this.updateGroup(id, {visibility});
        this.style.layers.forEach((layer) => {
            const groupId  = layer.metadata && layer.metadata.group;
            if(groupId === id) {
                this.updateLayer({ id: layer.id, visibility }, "layout");
            }
        });
    }

    /**
     * 切换图层可见性
     */
    toggleLayerVisibility = (id) => {
        const layer = this.getLayer(id);
        if(layer) {
            const visible = layer.layout && layer.layout.visibility;
            this.updateLayer({
                id, 
                visibility: visible === 'none' ? 'visible' : 'none'
            }, 'layout');
        }
    }

    getGroupFirstLayer = (id) => {
        const layers = this.getGroupLayers(id);
        return layers && layers[0];
    }

    getGroupLastLayer = (id) => {
        const layers = this.getGroupLayers(id);
        return layers && layers[layers.length - 1];
    }

    getLayerColor = (layerId) => {
        const layer = this.getLayer(layerId);
        const type = layer && layer.type;
        let color = "#333333";
        if(type) {
            if(type === "circle") {
                color = layer.paint["circle-color"];
            }
            if(type === 'line') {
                color = layer.paint["line-color"];
            }
            if(type === 'fill') {
                color = layer.paint["fill-color"];
            }
            if(type === 'fill-extrusion') {
                color = layer.paint["fill-extrusion-color"];
            }
        }
        return color;
    }

    getDefaultColorOption = (type) => {
        if(type === 'circle') {
            return {
                "circle-color": randomColor()
            }
        }
        if(type === 'line') {
            return {
                "line-color": randomColor()
            }
        }
        if(type === 'fill') {
            return {
                "fill-color": randomColor()
            }
        }
        if(type === 'fill-extrusion') {
            return {
                "fill-extrusion-color": randomColor()
            }
        }
    }

    // 添加图层
    addLayer = (layer, options) => {
        if(!layer || !layer.id) return false;
        const _layer = this.getLayer(layer.id);
        if(_layer) return;
        const ops = merge({toBottom: false}, options || {});
        const newLayer = cloneJson(layer);
        if(!newLayer.layout) newLayer.layout = {};
        if(!newLayer.paint) newLayer.paint = {};
        const colorOptions = this.getDefaultColorOption(newLayer.type);
        if(colorOptions) {
            mixin(newLayer.paint, colorOptions);
        }
        if(!newLayer.filter) newLayer.filter = ['all'];
        if(!newLayer.metadata) newLayer.metadata = {name: layer.id || '未命名'};
        const layers = this.style.layers;
       
        if(ops.toBottom) {
            layers.unshift(newLayer);
            this.map.addLayer(newLayer);
            this.map.bringToBottom(newLayer.id);
        } else {
            layers.push(newLayer);
            this.map.addLayer(newLayer);
            if(ops.beforeId) {
                this.move({
                    sourceId: newLayer.id, 
                    targetId: ops.beforeId, 
                    position: ops.position || "before"
                });
            }
        }
        return this.update();
    }


    /**
     * 整体替换图层
     */
    setLayer = (layer) => {
        if(!layer || !layer.id) return false;
        const _layer = this.getLayer(layer.id);
        if(!_layer) return false;
        const style = cloneJson(this.style);
        for(let i = 0;i<style.layers.length;i++) {
            if(style.layers[i].id=== layer.id) {
                style.layers[i] = layer;
                break;
            }
        }
        if(!this.validateStyleBySpec(style)) return false;
        // this.setStyle(style);
        this.style = style;
        this.update();
        const map = this.map;
        if(map) {
            if(layer.layout) {
                for(const key in layer.layout) {
                    map.setLayoutProperty(layer.id, key, layer.layout[key]);
                }
            }
            if(layer.paint) {
                for(const key in layer.paint) {
                    map.setPaintProperty(layer.id, key, layer.paint[key]);
                }
            }
        }
        return true;
    }

    moveToBottom = (layerId) => {
        const layers = this.style.layers;
        if(layers && layers[0]) {
            this.move({sourceId: layerId, targetId:layers[0].id});
        }
    }

    moveToTop = (layerId) => {
        const layer = this.getLayer(layerId, true);
        if(layer.metadata && layer.metadata.group) {
            delete layer.metadata.group;
        }
        this._moveLayer(layerId);
        const group = this.style.metadata.group;
        if(group) {
            group.forEach((gr) => {
                if(gr && !gr.beforeId) {
                    gr.beforeId = layerId;
                }
            });
        }
        this.update();
    }

    moveLayer = ({sourceId,  targetId, position = 'before'}) => {
        if(!sourceId || !targetId || !this.getLayer(sourceId) || !this.getLayer(targetId)) return;
        const layers = this.style.layers;
        if(layers.length === 0) return;
        const sindex = getObjectFromArray(layers, 'id', sourceId, true);
        const tindex = getObjectFromArray(layers, 'id', targetId, true);
        let newIndex = tindex;
        if(position === 'after' && newIndex !== 0) {
            newIndex = tindex;
        }
        if(position === 'before' && newIndex !== (layers.length - 1)) {
            newIndex = tindex;
        }
        const preId = layers[newIndex] && layers[newIndex].id;
        moveInArray(layers, sindex, newIndex);
        if(map && map.getLayer(sourceId) && map.getLayer(preId)) {
            map.moveLayer(sourceId, preId);
        }
        this.update();
    }


    /**
     * 获取源
     * @param {Object} style 样式文件
     * @param {String} sourceId 源ID
     * @return {Object} source
     */
    getSource = (sourceId) => {
        const style = this.style;
        if(!style || !style.sources || isEmptyObject(style.sources) ) return null;
        return style.sources[sourceId];
    }

    // 添加矢量图层数据源规范
    addVectorSourceSpec = (sourceId, callback) => {
        const source = this.getSource(sourceId);
        if(source && source.url && !this.sources[sourceId]) {
            let url = source.url;
            if(source.url.lastIndexOf('/') !== source.url.length - 1) {
                url = url + '/';
            }
            source.url = replaceAll(url, getHost(), 'atlasdata://');
            url = replaceAll(url, 'atlasdata://', getHost());
            ajax_get({url}).then((data) => {
                this.sources[sourceId] = data;
                callback && callback(data);
                this.update();
            });
        }
    }

    // 获取矢量数据源规范
    getVectorSourceSepc = (sourceId) => {
        return this.sources[sourceId];
    }

    // 添加 Source
    addSource = (sourceId, source) => {
        const style = this.style;
        if(!sourceId || isEmptyObject(source)) {
            log.error('mapedit-updateSource error');
            return;
        }
        if(style.sources[sourceId]) return;
        style.sources[sourceId] = source;
        const map = this.map;
        if(map && !map.getSource(sourceId)) {
           map.addSource(sourceId, source);
        }
        this.addVectorSourceSpec(sourceId);
        this.update();
    }

    // 更新 Source
    updateSource = (sourceId, source) => {
        const style = this.style;
        if(!sourceId || isEmptyObject(source)) {
            log.error('mapedit-updateSource error');
            return;
        }
        style.sources[sourceId] = source;
        this.addVectorSourceSpec(sourceId);
        const map = this.map;
        if(map && !map.getSource(sourceId)) {
           map.addSource(sourceId, source) ;
        }
        this.update();
    }

    // 删除 Source
    removeSource = (sourceId) => {
        const {style} = this;
        const source = this.getSource(sourceId);
        if(!style || !source) return;
        const map = this.map;
        delete style.sources[sourceId];
        delete this.sources[sourceId];
        if(map && map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
        this.update();
    }

    /**
     * 替换Source
     */
    replaceSource = ({layerId, layerType, sourceId, source, sourceLayer}) => {
        const layer = this.getLayer(layerId);
        if(!layer) return;
        if(layer.source === sourceId) return;
        const newSource = this.getSource(sourceId);
        if(!newSource)  {
            this.addSource(sourceId, source);
        }
        const map = this.map;
        const style = this.style;
        style.layers.forEach((layer, index) => {
            if(layer.id === layerId) {
                layer.source = sourceId;
                layer.type = layerType;
                layer.paint = {};
                layer.layout = {};
                if(sourceLayer) {
                    layer['source-layer'] = sourceLayer;
                }
                let beforeIndex = index - 1;
                if(index === 0) {
                    beforeIndex = 1;
                }
                if(index === style.layers.length - 1) {
                    beforeIndex = index - 1;
                }
                if(map && map.getLayer(layerId)) {
                    const beforeId = style.layers[beforeIndex] && style.layers[beforeIndex].id;
                    map.removeLayer(layerId);
                    map.addLayer(layer, beforeId);
                }
                return;
            }
        });
        this.update();
    }

    /**
     * 替换SourceLayer, 替换仍是矢量类型
     */
    replaceSourceLayer = ({layerId, newSourceLayer}) => {
        const layer = this.getLayer(layerId);
        if(!layer) return;
        this.style.layers.forEach((layer) => {
            if(layer.id === layerId) {
                layer['source-layer'] = newSourceLayer;
            }
        });
        this.update();
    }
    
    updateMapState = () => {
        const map = this.map;
        const style = this.style;
        if(map) {
            style.center = map.getCenter().toArray().map(e => formatNum(e, 7));
            style.pitch = formatNum(map.getPitch(), 2);
            style.bearing = formatNum(map.getBearing(), 2);
            style.zoom = formatNum(map.getZoom(), 2);
            this.update();
        }
    }

    // 移除样式、地图、标准
    remove = () => {
        if(this.map) {
            
        }
        this.style = merge({}, BLANK_STYLE);
        this.sources = {};
    }

    inspectFeature = (e) => {
        const {style, map} = this;
        if(!map || !style) return;
        const bbox = {width: 10, height: 10};
        let features = map.queryRenderedFeatures([
            [e.point.x - bbox.width / 2, e.point.y - bbox.height / 2],
            [e.point.x + bbox.width / 2, e.point.y + bbox.height / 2]
        ]);
        const ids = style.layers.map(layer => layer.id);
        const feature = features.filter((feature) => {
            return contain(ids, feature.layer.id) >= 0;
        })[0];
        if(feature) {
            map.setCursor('pointer');
        } else {
            map.setCursor();
        }
    }

    showFeatureInfo = (e) => {
        const {map, style, inspectorPopup} = this;
        if(!map || !style || !inspectorPopup) return;
        const bbox = {width: 10, height: 10};
        let features = map.queryRenderedFeatures([
            [e.point.x - bbox.width / 2, e.point.y - bbox.height / 2],
            [e.point.x + bbox.width / 2, e.point.y + bbox.height / 2]
        ]);
        const ids = style.layers.map(layer => layer.id);
        const feature = features.filter((feature) => {
            return contain(ids, feature.layer.id) >= 0;
        })[0];
        if(inspectorPopup && feature) {
            const {properties} = feature;
            let html = '<div class="at-inspect-popup"><table><tbody>';
            for(const key in properties) {
                if(contain(['id', 'sid'], key) < 0) {
                    html += `<tr><td>${key}</td><td>${properties[key] || ''}</td></tr>`;
                }
            }
            html += '</tbody></table></div>';
            inspectorPopup.setLngLat(e.lngLat).setHTML(html).addTo(map);
        } else {
            inspectorPopup.remove();
        }
    }
}
