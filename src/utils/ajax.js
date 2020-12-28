import axios from 'axios';
import config from '../config';
import Toaster from '../components/Toaster';
import Local from './local';
import { isEmptyObject, isArray } from './util';

export function getHost() {
    let host = config.host;
    if(host.lastIndexOf('/') !== (host.length - 1)) {
        host += '/';
    }
    return host;
}


export const ajax = axios;

//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }
    
    // Increase the retry count
    config.__retryCount += 1;
    
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
        return axios(config);
    });
});

function getAjax(noRequestAuth) {
    const createParam = {
        baseURL: getHost(),
        headers: {},
    };
    if(!noRequestAuth) {
        const token = Local.get('token');
        const Authorization = token &&  ('Bearer ' + token);
        createParam.headers.Authorization = Authorization;
        createParam.withCredentials = true;
    }
    return axios.create(createParam);
}

export const CODES = {
    0: "检查消息",
    200: "成功",
    201: "已创建",
    202: "已接受",
    204: "无内容",
    300: "重定向",
    400: "请求无法解析",
    4001: "必填参数校验错误",
    4002: "达到最大尝试登录次数,稍后再试",
    4003: "瓦片请求格式错误",
    4004: "符号请求格式错误",
    4005: "字体请求格式错误",
    401: "未授权",
    4011: "用户名或密码错误",
    4012: "用户名或密码非法",
    403: "禁止访问",
    4031: "用户已存在",
    404: "找不到资源",
    4041: "用户不存在",
    4042: "角色不存在",
    4043: "资源不存在",
    4044: "资源组不存在",
    4045: "找不到上传文件",
    4046: "找不到样式服务",
    4047: "找不到底图服务",
    4048: "找不到数据服务",
    408: "请求超时",
    500: "系统错误",
    5001: "数据库错误",
    5002: "文件读写错误",
    5003: "IO读写错误",
    5004: "MBTiles读写错误",
    501: "维护中",
    503: "服务不可用",
};


export function ajax_post({url = '', data = null, noRequestAuth = false}) {
    const Ajax = getAjax(noRequestAuth);
    return new Promise((resolve, reject) => {
        Ajax({
            method: "POST",
            headers: { 'Content-type': 'application/json' },
            url,
            data,
            //withCredentials:true
        }).then(function (res) {
            resolve(res && res.data);
        }).catch(function (error) {
            reject(error);
            // Toaster.show({message: '服务器连接异常, 请联系管理员', intent:'warning'});
        });
    });
}

export function ajax_get({url = '', data = null, noRequestAuth = false}) {
    const Ajax = getAjax(noRequestAuth);
    if(data && !isEmptyObject(data)) {
        url += '?' + Object.keys(data)
            .map((key) => `${key}=${data[key]}`).join("&");
    }
    return new Promise((resolve, reject) => {
        Ajax({
            method: "GET",
            headers: { 'Content-type': 'application/json', },
            url,
            // withCredentials:true
        }).then(function (res) {
            resolve(res && res.data);
        }).catch(function (error) {
            // Toaster.show({message: '服务器连接异常, 请联系管理员', intent:'warning'});
            reject(error);
        });
    });
}

export function ajax_post_params({url, data, noRequestAuth}) {
    const Ajax = getAjax(noRequestAuth);
    return new Promise((resolve, reject) => {
        Ajax({
            method: 'post',
            url,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            params: data,
        })
            .then(function (res) {
                resolve(res && res.data);
            }).catch(function (error) {
                reject(error);
                // Toaster.show({message: '服务器连接异常, 请联系管理员', intent:'warning'});
            });
    });
}

export function ajax_upload_file({url, data, noRequestAuth}) {
    const Ajax = getAjax(noRequestAuth);
    const fileData = new FormData();
    fileData.append('file', data);
    return new Promise((resolve, reject) => {
        Ajax({
            method: 'post',
            url,
            headers: {
                'Content-type': 'multipart/form-data',
            },
            data: fileData,
        })
        .then(function (res) {
            resolve(res && res.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}

/**
 * 带进度上传
 * @param {String} url 上传地址
 * @param {Form} data 上传文件
 * @param {Function} onUploadProgress 进度更新文件
 */
export function ajax_upload_file_width_progress({mode, url, data, setCancelToken, onUploadProgress, noRequestAuth}) {
    if(!data) return;
    const Ajax = getAjax(noRequestAuth);
    const fileData = new FormData();
    if(data.length >= 1 && mode == 'multi') {
        for(let i = 0; i < data.length; i++){
            fileData.append("files", data[i]);
        }
    } else {
        fileData.append('file', data);
    }
    return new Promise((resolve, reject) => {
        Ajax({
            url,
            method: 'post',
            data: fileData,
            cancelToken: new axios.CancelToken((c) => {setCancelToken && setCancelToken(c)}),
            onUploadProgress:(progressEvent) => {
                onUploadProgress 
                && onUploadProgress((progressEvent.loaded / progressEvent.total * 100 | 0) + '%')
            }
        })
        .then(function (res) {
            resolve(res && res.data);
        })
        .catch(function (thrown) {
            if(axios.isCancel(thrown)) {
                Toaster.show({
                    icon: 'info-sign',
                    message:'已取消上传 ' + (thrown.message || ''), 
                    intent:'warning', 
                    timeout: 2000
                });
            } else {
                reject(thrown);
            }
        });
    });
}

export function saga({type, url, payload}) {
    return () => {
        if(type === 'get') {
            return ajax_get({url}).then(data => data).catch(error => error);
        }
        if(type === 'postByParams') {
            return ajax_post_params({url, data: payload}).then(data => data).catch(error => error);
        }
        if(type === 'post') {
            return ajax_post({url, data:payload}).then(data => data).catch(error => error);
        }
    }
}