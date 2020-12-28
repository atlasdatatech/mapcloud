import { guid, contain } from './util';
import {ATLAS_EXT_PRE} from '../const/core';
/**
 * 根据Geometry类型获取图层类型
 */
export function getLayerTypeByGeometryType(type) {
    if(!type) return 'circle';
    type = type.toLowerCase();
    if(type.indexOf('point') >= 0) return 'circle';
    if(type.indexOf('line') >= 0) return 'line';
    if(type.indexOf('polygon') >= 0) return 'fill';
    if(('jpg|png|webp|raster').indexOf(type) >= 0) return 'raster';
    const csvgeotype = type.split(',');
    if(type.indexOf(',') >= 0 && csvgeotype.length === 2) return 'circle';
    return type;
}

export function getId(type) {
    return `${ATLAS_EXT_PRE}-${type}-${guid(true)}`;
}

export function isVectorLayer(type) {
    return contain(['circle', 'fill','fill-extrusion','heatmap','line','symbol'], type) >= 0;
}