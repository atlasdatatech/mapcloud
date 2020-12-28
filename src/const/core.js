import { guid } from '../utils/util';

// 新地图样式
export const BLANK_STYLE = {
    version: 8,
    name: '新地图',
    sprite: '',
    glyphs: '',
    sources: [],
    layers: []
};

// 矢量
export const BLANK_SOURCE_VECTOR = {
    type: 'vector',
    url: '',
    tiles:[],
    bounds: '',
    schema: 'xyz',
    minzoom: '',
    maxzoom: '',
    attribution: ''
};

// 栅格
export const BLANK_SOURCE_RASTER = {
    type: 'raster',
    url: '',
    tileSize: 256,
    tiles:[],
    bounds: '',
    schema: 'xyz',
    minzoom: '',
    maxzoom: '',
    attribution: ''
};

// 栅格地形
export const BLANK_SOURCE_RASTER_DEM = {
    type: 'raster-dem',
    url: '',
    tileSize: 256,
    tiles:[],
    bounds: '',
    schema: 'xyz',
    minzoom: '',
    maxzoom: '',
    attribution: '',
    encoding:'mapbox', // "terrarium", "mapbox"
};

// 新Source geojson
export const BLANK_GEOJSON = {
    type: 'geojson',
    data: '',
    maxzoom: 18,
    attribution:'',
    buffer:'',
    tolerance: 0.375,
    cluster: false,
    clusterRadius: 0,
    clusterMaxZoom: 0,
    clusterProperties: null,
    lineMetrics: false,
    generateId: false,
};

// 新Source image
export const BLANK_IMAGE = {
    type: 'image',
    url: '',
    coordinates: null,
};

// 新Source video
export const BLANK_VIDEO = {
    type: 'video',
    url: [],
    coordinates: null,
};

// 新图层
export const BLANK_LAYER = {
    id: guid(true),
    type: '',
    paint: {},
    layout: {},
    minzoom: undefined,
    maxzoom: undefined,
    metadata: {name:'未命名图层',group:''}
};

// 图层前缀
export const ATLAS_EXT_PRE = 'atlasdata-ext';

// 字符编码
export const CODES = ['UTF-8', 'GBK', 'BIG5', 'GB2312', 'GB18030', 'LATIN1'];

// 坐标系
export const CRSS = ['WGS84', 'CGCS2000', 'GCJ02', '百度'];

// 数据集上传支持格式
export const UPLOAD_DATASET_TYPES = ['zip', 'csv', 'geojson', 'kml', 'gpx'];

// 服务集上传支持格式
export const UPLOAD_TILESET_TYPES = ['mbtiles', 'kmz', 'zip', 'csv', 'geojson', 'kml', 'gpx', 'tif', 'tiff', 'geotiff'];

// 上传样式支持格式
export const UPLOAD_STYLE_TYPES = ['zip'];

// 上传图标样式
export const UPLOAD_ICON_TYPES = ['svg', 'png', 'jpg', 'bmp', 'gif'];

// 上传数据集大小限制 25M
export const DATASET_LIMIT_SIZE= 250 * 1024 * 1024;

// 上传服务集大小限制 25
export const TILESET_LIMIT_SIZE = 250 * 1024 * 1024;

// 上传服务集MBTILES大小限制 250
export const TILESET_MBTILES_LIMIT_SIZE = 250 * 1024 * 1024;

// 上传样式大小限制 5M
export const STYLE_LIMIT_SIZE = 5 * 1024 * 1024;

// 上传图标大小限制 5M
export const ICON_LIMIT_SIZE = 0.5 * 1024 * 1024;

// 上传任务限制
export const MAX_TASK = 10;


// background|raster|circle|fill|fill-extrusion|heatmap|hillshade|line|symbol
export const VECTOR_LAYER_TYPES = ['circle', 'fill', 'fill-extrusion', 'heatmap', 'line', 'symbol'];

export const POINT_TYPES  = ['circle', 'symbol'];

export const LINE_TYPES  = ['line'];

export const POLYGON_TYPES  = ['fill', 'fill-extrusion'];

// 地图初始化中心点
export const MAP_CENTER = [108.15464353498965, 37.7580571167922];

// 地图初始化层级
export const MAP_ZOOM = 3;

export const MAP_STYLE = 'http://47.100.237.57:8080/styles/basic';

export const PAGE_SIZE = {
    map: 8,
    dataset: 10,
    tileset: 10,
};