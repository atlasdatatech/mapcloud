import config from '../config';
import Local from '../utils/local';

export function EditMap({ container, style, updateState}) {
    if(!container || !window.atlas) return null;
    atlas.setConfig({
        accessToken: Local.get('access_token'),
        apiUrl: config.host.substring(0, config.host.length - 1)
    });
    const options = {
        container,
        // renderWorldCopies:false,
    };
    if(style) {
        options.style = style;
    }
    const map = new atlas.Map(options);

    return map;
}