import router from 'umi/router';

export const ROUTES = {
    MAP_LIST: '/map/list',
    APP_LIST: '/app/list',
    DATASET_LIST: '/dataset/list',
    TILESET_LIST: '/ts/list',
    ACCOUNT: '/account',
    TOKEN: '/account/token',
    PASSWORD: '/account/password',
    LOGIN: '/login'
};

export function setRouter(link) {
    router.push(link);
}