import config from '../config';
import Local from './local';

export function getMapViewLink(id) {
    return id && `${location.origin}/view.html?id=${id}&access_token=${Local.getAccessToken()}`;  
}

export function getMapStyleLink(id) {
    return id && `atlasdata://maps/x/${id}/`;
}

export function getDevLink(id) {
    return (id && `http://www.atlasdata.cn/dev/#/${id}`) || '';
}