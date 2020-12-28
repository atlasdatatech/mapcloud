import config from '../config';
import Local from '../utils/local';
import {contain} from '../utils/util';

export function detailMap({ container, url, tileset, updateState}) {
    if(!container || !url || !tileset) return null;
    atlas.setConfig({
        accessToken: Local.get('access_token'),
        apiUrl: config.host.substring(0, config.host.length - 1)
    });
    const _url = "atlasdata://" + url;
    let type = 'vector';
    let layers = [];
    let sources = {
        'tilesetid': {
            type: 'vector',
            url: _url
        }
    };
    if (contain(['jpg', 'jpeg', 'png'], tileset.format) >= 0 && tileset.tiles) {
        type = 'image';
        sources = {
            "tilesetid": {
                type: 'raster',
                tileSize: 256,
                tiles: tileset.tiles,
            }
        };
        layers = [
            {
                'id': 'layerid',
                'type': 'raster',
                'source': 'tilesetid',
                'paint': {}
            }
        ]
    }
    const map = new atlas.Map({
        container,
        style: {
            version: 8,
            sources,
            layers
        }
    });
    map.addControl(new atlas.FullscreenControl(),"top-right");
    let inspect = null;
    if (type === 'vector' && window.MapboxInspect) {
        inspect = new MapboxInspect({
            showInspectMap: true,
            showInspectButton: false
        });
        map.addControl(inspect);
    }
    map.on('styledata', () => {
        const {center, bound} = tileset;
        if(bound && bound.length === 4) {
            map.fitBounds([[bound[0], bound[1]], [bound[2], bound[3]]]);
        } else if(center && center.length >= 2) {
            map.setCenter(center.slice(0, 2));
            if(center[2]) {
                map.setZoom(center[2]);
            }
        }
        if (type === 'vector' && inspect) {
            let layers = [];
            Object.keys(inspect.sources).forEach((sourceId) => {
                const layerIds = inspect.sources[sourceId];
                layerIds.forEach((layerId) => {
                    layers.push({
                        id: layerId,
                        color: inspect.assignLayerColor(layerId)
                    })
                });
            });
            updateState({layers})
        }
        if (type === 'image') {

        }
    });

    return map;
}