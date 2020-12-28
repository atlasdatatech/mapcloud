const tiandituToken = "9b3fdce6018190be9485d82d1da15758";
export default {
    TIANDITU: [
        {
            name: "天地图矢量",
            id: "atlas-basemap-tianditu-1",
            type: "矢量栅格瓦片 球面墨卡托投影",
            thumbnail: "tianditu.jpg",
            source: 'raster',
            _source: {
                type: 'raster',
                'tiles': [
                    `http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${tiandituToken}`
                ],
                'tileSize': 256
            }
        },
        {
            name: "天地图矢量标注",
            id: "atlas-basemap-tianditu-2",
            type: "矢量栅格瓦片 球面墨卡托投影",
            thumbnail: "tianditu.jpg",
            source: 'raster',
            _source: {
                type: 'raster',
                'tiles': [
                    `http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${tiandituToken}`
                ],
                'tileSize': 256
            }
        },
        {
            name: "天地图影像",
            id: "atlas-basemap-tianditu-3",
            type: "影像栅格瓦片 球面墨卡托投影",
            thumbnail: "tianditu.jpg",
            source: 'raster',
            _source: {
                type: 'raster',
                'tiles': [
                    `http://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${tiandituToken}`
                ],
                'tileSize': 256
            }
        },
        {
            name: "天地图影像标注",
            id: "atlas-basemap-tianditu-4",
            type: "影像栅格瓦片 球面墨卡托投影",
            thumbnail: "tianditu.jpg",
            source: 'raster',
            _source: {
                type: 'raster',
                'tiles': [
                    `http://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${tiandituToken}`
                ],
                'tileSize': 256
            }
        }
    ],
    // BAIDU: [
    //     {
    //         name: '百度栅格地图', 
    //         id: 'atlas-basemap-baidu-1',
    //         type: '影像栅格瓦片 球面墨卡托投影',
    //         source:'raster',
    //         thumbnail: 'baidu.jpg',
    //         _source: {
    //             type: 'raster',
    //             'tiles': [
    //                 'http://shangetu1.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46&udt=20130506'
    //             ],
    //             'tileSize': 256
    //         }
    //     },
    // ],
    // https://webst01.is.autonavi.com/appmaptile?style=6&x=218991&y=107085&z=18
    GAODE: [
        {
            name: '高德栅格地图', 
            id: 'atlas-basemap-gaode-1',
            type: '矢量栅格瓦片 球面墨卡托投影',
            source:'raster',
            thumbnail: 'gaode.jpg',
            _source: {
                type: 'raster',
                'tiles': [
                    'http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
                ],
                'tileSize': 256
            }
        },
        {
            name: '高德影像地图', 
            id: 'atlas-basemap-gaode-2',
            type: '影像栅格瓦片 球面墨卡托投影',
            source:'raster',
            thumbnail: 'gaode.jpg',
            _source: {
                type: 'raster',
                'tiles': [
                    'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
                ],
                'tileSize': 256
            }
        },
        {
            name: '高德影像标注', 
            id: 'atlas-basemap-gaode-3',
            type: '影像栅格瓦片 球面墨卡托投影',
            source:'raster',
            thumbnail: 'gaode.jpg',
            _source: {
                type: 'raster',
                'tiles': [
                    'http://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&ltype=11&x={x}&y={y}&z={z}'
                ],
                'tileSize': 256
            }
        },
    ],
    GOOGLE: [
        {
            name: '谷歌栅格地图', 
            id: 'atlas-basemap-google-1',
            type: '矢量栅格瓦片 球面墨卡托投影',
            source:'raster',
            thumbnail: 'google.png',
            _source: {
                type: 'raster',
                'tiles': [
                    'http://mt0.google.cn/vt/lyrs=m&x={x}&y={y}&z={z}'
                ],
                'tileSize': 256
            }
        },
        {
            name: '谷歌影像',
            id: 'atlas-base-map-google-2',
            type: '影像栅格 球面墨卡托投影',
            source:'raster',
            thumbnail: 'google.png',
            _source:{
                type: 'raster',
                'tiles': [
                    // 'http://mt0.google.cn/vt/lyrs=s&x={x}&y={y}&z={z}'
                    'https://mt2.google.cn/maps/vt?lyrs=y&hl=zh-CN&gl=CN&&x={x}&y={y}&z={z}&scale=1'
                ],
                'tileSize': 256
            }
        }
    ],
    ESRI: [
        {
            name: 'ArcGIS栅格地图',
            id: 'atlas-basemap-esri-1',
            type: '矢量栅格瓦片 球面墨卡托投影',
            source:'raster',
            thumbnail: 'esri.png',
            _source:{
                type: 'raster',
                'tiles': [
                    'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}'
                ],
                'tileSize': 256
            }
        },
        {
            name: 'ArcGIS栅格地图-Warm',
            id: 'atlas-basemap-esri-2',
            type: '矢量栅格瓦片 球面墨卡托投影',
            source:'raster',
            thumbnail: 'esri.png',
            _source: {
                type: 'raster',
                'tiles': [
                    'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}'
                ],
                'tileSize': 256
            }
        },
        {
            name: 'ArcGIS栅格地图-Gray',
            id: 'atlas-basemap-esri-3',
            type: '矢量栅格瓦片 球面墨卡托投影',
            source:'raster',
            thumbnail: 'esri.png',
            _source: {
                type: 'raster',
                'tiles': [
                    'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}'
                ],
                'tileSize': 256
            }
        },
        {
            name: 'ArcGIS栅格地图-PurplishBlu',
            id: 'atlas-basemap-esri-4',
            type: '矢量栅格瓦片 球面墨卡托投影',
            source:'raster',
            thumbnail: 'esri.png',
            _source: {
                type: 'raster',
                'tiles': [
                    'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
                ],
                'tileSize': 256
            }
        },
    ],
    OSM: [
        {
            name: 'OSM栅格地图',
            id: 'atlas-basemap-osm-1',
            type: '矢量栅格瓦片 球面墨卡托投影',
            thumbnail: 'osm.svg',
            source:'raster',
            _source: {
                type: 'raster',
                'tiles': [
                    'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                'tileSize': 256
            },
         }
    ],
    
}