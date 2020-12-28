export const BASEMAP_MAP = {
    "groups": {
        "roads": {
            "show": true,
            name: '道路',
            layers: [
                'bridge_major', // 主桥梁
                'bridge_minor', //
                'bridge_major case',
                'bridge_minor case',
                'railway',
            ]
            "forceColor": false
        },
        "water": {
            "show": true,
            name: '水域',
            layers: [
                'waterway-bridge',
                'waterway-bridge-case',
            ],
            "forceColor": false
        },
        "nature": {
            "show": true,
            nature: '自然',
            layers: [
                ''
            ],
            "forceColor": false
        },
        "glaciers": {
            "show": true,
            name: '冰川',
            layers: [
                '',
            ],
        },
        "landscape": {
            "show": true,
            name: '地形',
            layers: [
                ''
            ],
            "forceColor": false
        },
        "placenames": {
            "show": true,
            name: '地名',
            layers: [
                ''
            ],
            "forceColor": false
        },
        "administrative": {
            "show": true,
            name: '行政区域',
            layers: [
                ''
            ],
            "forceColor": false
        }
    },
    "remove3d": true
}