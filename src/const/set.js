// 图层类型
export const LAYER_TYPE = [
        'background', 'raster' , 'circle', 'fill', 'fill-extrusion', 
        'heatmap', 'hillshade', 'line', 'symbol'
    ];

// 数据源类型
export const SOURCE_TYPE = ['vector','raster', 'raster-dem', 'geojson', 'image', 'video'];

export const VALUE_TYPE = ['color', 'string', 'formatted', 'boolean', 'number', 'array'];

// 表达式
export const EXPRESSION = {
    has: ['has', '!has'], // 是否包含， 带key, 不带value
    exp: ['==', '!==', '>', '>=', '<', '<=', 'in', '!in'], // key,value
    in: ['in', '!in'], // 是否在范围内
    range: ['all', 'none', 'any']
};
