import router from 'umi/router';
import { getTimescore } from './util';
import PL from 'popoload';

const config = {path: {
    root: './', 
    // mapbox: 'http://localhost:8215/repos/map/mapbox/mapbox-gl-js-0.52.0/dist/',
    // sdk:'http://localhost:8215/atlas/sdk/atlas/dist/',
    static: "http://static.atlasdata.cn/",
    atlas: "http://static.atlasdata.cn/sdk/atlas/3.0.1/"
}};
// F:\atlas\sdk\atlas\dist
const version = "v3.0.1";
export const loadAtlas = (loaded) => {
    PL({
        config,
        libs: [
            // 'root:libs/atlas/atlas.min.js?v='+ version,
            // "mapbox:mapbox-gl-dev.js",
            'atlas:atlas.min.js',
        ],
        styles: [
            'atlas:atlas.min.css',
        ],
        loaded: () => {
            if(!window.atlas || !atlas.supported()) {
                router.push('/nosupport');
            } else {
                loaded();
            }
        }
    });
}

export const loadAtlasByInspector = (loaded) => {
    PL({
        config,
        libs: [
            // "mapbox:mapbox-gl-dev.js",
            // "sdk:atlas.src.js",
            // "sdk:atlas.min.js",
            'atlas:atlas.min.js',
            'root:libs/mapbox/mapbox-gl-inspect.min.js',
        ],
        styles: [
            'atlas:atlas.min.css',
            'root:libs/mapbox/mapbox-gl-inspect.css',
        ],
        loaded: () => {
            if(!window.atlas || !atlas.supported()) {
                router.push('/nosupport');
            } else {
                loaded();
            }
        }
    });
}