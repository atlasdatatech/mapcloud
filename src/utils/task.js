import Local from './local';
import {getObjectFromArray, removeObjectFromArray, isFunction, 
        cloneJson, guid, isObject, isArray, contain, trim} from './util';
import { ajax_get, ajax_post, ajax_upload_file_width_progress } from './ajax';
import { ToasterError } from '../components/Toaster';
import {getFilename, getFileSize, getFileNameExt} from './file';
import {MAX_TASK} from '../const/core';


const LOCAL_TASK = 'localTempTask';
const LOCAL_HANDLE = 'localTempTaskHandles';

/**
 * 任务列表处理类
 */
export default class TaskHelper {

    constructor() {

        this.id = guid(true);

        // 主任务列表
        this.list = [];

        // 服务器处理任务列表
        this.handles = [];

        // 退出函数
        this.cancels = {};

        // 回调函数
        this.callbacks = {};

        this.handleTimer = null;

        // 任务刷新时间
        this.handleInteval = 5000;

        this.init();

    }

    handleUpdateEvent = () => {

    }

    setCallback = ({type, fn}) => {
        this.callbacks[type] = fn;
    }

    init = () => {
        const localTask = Local.get(LOCAL_TASK);
        if(localTask) {
            this.list = localTask.filter(t => t.handleProgress !== '100%')
            // .map(t => {
            //     t.error ="valid";
            //     return t;
            // });
        }
        const localHandle = Local.get(LOCAL_HANDLE);
        if(localHandle) {
            this.handles = localHandle.filter(h => h.progress !== 100);
        }
        this.update({immediatelyUpdateHandle: true});
        setTimeout(() => {
            this.list.forEach((task) => {
                if(task.progress !== '100%') {
                    this.updateTask({id: task.id, key:'status', value: 2});
                }
            })
        }, 5000);
    }

    /**
     * 获取任务整体进度
     */
    getTaskProgress = (id) =>{
        const task = this.getTask(id);
        if(!task) return '0%';
        if(task.type === 'dataset') {
            if(!task.previews || !task.previews.length) return '0%';
            const handles = task.previews.map(p => this.getHandleByBase(p.id)).filter(d => d);
            if(!handles || !handles.length) return '0%';
            let total = 0;
            handles.forEach((t) => {
                if(t.progress === 100) {
                    total += 1;
                }
            });
            return `${Math.round((total / handles.length) * 100)}%`
        }
        if(task.type === 'ts' && task.base) {
            const handle = this.getHandleByBase(task.base);
            if(!handle) return null;
            return `${Math.round(handle.progress)}%`;
        }
        return "0%";
    }

    stopHandleUpdate = () => {
        clearInterval(this.handleTimer);
        this.handleTimer = null;
    }

    /**
     * 更新，或同步更新
     */
    update = (options) => {
        const task = this.getAllTask();
        options = options || {};
        if(task) {
            window.g_app._store.dispatch({type: 'task/save', payload: {task}});
            Local.set(LOCAL_TASK, task);
        }
        const handles = this.handles;
        if(handles) {
            window.g_app._store.dispatch({type: 'task/save', payload: {handles}});
            Local.set(LOCAL_HANDLE, handles);
            // this.updateHandle();
            if(options.immediatelyUpdateHandle) {
                this.updateHandle();
            }
            if(!this.handleTimer) {
                this.handleTimer = setInterval(() => {
                    this.updateHandle();
                }, this.handleInteval || 5000);
            }
        }
        if(!handles || handles.length === 0) {
            this.stopHandleUpdate();
        }
    }

    /**
     * 打开任务窗口
     */
    showModal = (visible) => {
        window.g_app._store.dispatch({type: 'task/save', payload: {showModal: visible}});
    }

    /**
     * 获取任务统计信息
     */
    getStatus = () => {
        const task = this.list;
        const handles = this.handles;
        if(!task || !handles) return null;
        const msg = {
            upload: 0, // 上传中
            uploadEnd: 0, // 上传完成
            waitHandle: 0, // 等待处理
            handle: 0, // 处理中
            handleEnd: 0, // 处理完成
            error: 0 // 错误
        };
        task.forEach((t) => {
            if(t.progress === '100%') {
                msg.uploadEnd += 1;
            } else {
                msg.upload += 1;
            }
            if(t.error && trim(t.error)) {
                msg.error += 1;
            }
            if(t.previews && t.previews.length > 0) {
                msg.waitHandle += t.previews.filter(p => p.progress === -1 && !p.error).length;
            }
            if(t.progress === '100%' && t.handleProgress !== null && t.handleProgress !== '100%') {
                msg.handle += 1;
            }
            if(t.progress === '100%' && t.handleProgress === '100%') {
                msg.handleEnd += 1;
            }
        });
        // if(handles && handles.length > 0) {
        //     for(let i = 0; i < handles.length; i++) {
        //         const _t = handles[i];
        //         if(_t.error && trim(_t.error)) {
        //             msg.error += 1;
        //         } else {
        //             if(_t.progress >= 0 && _t.progress < 100) {
        //                 msg.handle += 1;
        //             }
        //             if(_t.progress === 100) {
        //                 msg.handleEnd += 1;
        //             }
        //         }
        //     }
        // }
        return msg;
    }

    /**
     * 获取所有的上传任务
     */
    getAllTask = () => {
        return cloneJson(this.list);
    }

    /**
     * 上传任务ID
     */
    getTask = (id, ref) => {
        return ref ? getObjectFromArray(this.list, 'id', id) 
        : id && this.list.filter(task => task.id === id)[0];
    }

    /**
     * 删除任务
     */
    removeTask = (id) => {
        const task = this.getTask(id);
        if(!task) return;
        const cancel = this.cancels[id];
        if(cancel && isFunction(cancel)) {
            cancel(task.name);
            delete this.cancels[id];
        }
        removeObjectFromArray(this.list, 'id', id);
        this.update();
    }

    /**
     * 导入全部数据集
     */
    allPreviewsToHandle = (id) => {
        const task = this.getTask(id, true);
        if(!task || !task.previews || !task.previews.length) return;
        const previews = task.previews;
        previews.forEach((preview) => {
            if(preview && preview.id) {
                preview.progress = -1;
                this.previewToHandle({id, previewId: preview.id});
            }
        });
        // 任务状态为入库中
        this.updateTask({id: task.id, key: "status", value: 3});
        let timer = setInterval(() => {
            let flag = true;
            previews.forEach(p => {
                const hp = this.getHandleByBase(p.id);
                if(!hp) {
                    flag = false;
                }
            });
            if(flag) {
                clearInterval(timer);
                this.update({immediatelyUpdateHandle: true});
            }
        }, 300);
        // this.update();
    }

    /**
     * 导入单个数据集
     */
    previewToHandle = ({id, previewId}) => {
        const task = this.getTask(id, true);
        if(!task || !previewId) return;
        const preview = this.getPreview({id, previewId, ref: true});
        if(!preview) return;
        ajax_post({
            url: `datasets/import/${previewId}/`,
            data: preview
        }).then((res) => {
            if(res && res.code === 200 && res.data && res.data.id) {
                const data = res.data;
                if(data.error) {
                    preview.error = data.error;
                    preview.progress = -1;
                }
                this.addHandle(data);
            }
        });
    }

    /**
     * 获取远程任务合集
     */
    getTaskHandles = (id) => {
        const {handles} = this;
        const task = this.getTask(id);
        if(!task || !handles || handles.length === 0) return [];
        if(task.type === 'ts') return handles.filter((handle) => handle.base === task.id)[0];
        const previewIds = task.previews.map(p => p.id);
        return handles.filter(h => contain(previewIds, h.base) >= 0);
    }

    

    /**
     * 获取字段
     */
    getFields = ({id, previewId}) => {
        const preview = this.getPreview({id, previewId});
        return preview && ((preview && preview.fields) || []).filter(e => e);
    }

    /**
     * 获取记录
     */
    getRecords = ({id, previewId}) => {
        const preview = this.getPreview({id, previewId});
        return preview && ((preview && preview.rows) || []).slice(0, 7).filter(e => e);
    }

    /**
     * 获取预览数据集
     */
    getPreview = ({id, previewId, ref}) => {
        if(!ref) {
            const task = this.getTask(id);
            if(!task || !task.previews || !previewId) return null;
            return task.previews.filter(preview => preview.id === previewId)[0];
        } else {
            const task = this.getTask(id, true);
            if(!task || !task.previews || !previewId) return null;
            return getObjectFromArray(task.previews, 'id', previewId);
        }
    }

    /**
     * 获取数据集入库进度
     */
    getPreviewProgress = (previewId) => {
        const handle = this.getHandleByBase(previewId);
        if(!handle) return 0;
        return handle.progress || 0;
    }

    /**
     * 删除待入库预览数据集
     */
    removePreview = ({id, previewId}) => {
        const task = this.getTask(id, true);
        if(!task || !task.previews || !previewId) return null;
        removeObjectFromArray(task.previews, 'id', previewId);
        this.update();
    }

    /**
     * 保存前校验预览数据集
     * @param {String} id 任务ID
     * @param {String} previewId 数据集ID
     */
    validatePreview = ({id, previewId}) => {
        if(!id || !previewId) return false;
        const task = this.getTask(id);
        if(!task || !task.previews) return false;
        let isValidate = true;
        const fields = this.getFields({id, previewId});
        if(!fields.length) return false;
        task.previews.forEach((d) => {
            // 字段名称不能为空
            d.fields.forEach((f) => {
                if(!f.name) {
                    isValidate = false;
                }
            });
            // CSV 经纬度选择
            if(d.format === '.csv') {
                const lngLat = d.geotype.split(',');
                if(lngLat.length !== 2 || !lngLat[0] || !lngLat[1]) {
                    isValidate = false;
                }
            }
        });
        return isValidate;
    }

    /**
     * 更新预览编码
     */
    updatePreviewByEncoding = ({id, previewId, encoding}) => {
        if(!id || !previewId || !encoding) return;
        const dataset = this.getPreview({id, previewId, ref: true});
        if(!dataset || dataset.encoding === encoding) return;
        dataset.encoding = encoding;
        ajax_get({
            url:`datasets/preview/${previewId}/`, 
            data: {encoding}
        }).then((res) => {
            dataset.rows = (res.data && res.data.rows || []).filter(d => d);
            this.update();
        });
    }

    /**
     * 更新失败信息
     */
    updatePreviewError = ({id, previewId, error}) => {
        if(!id || !previewId) return;
        const dataset = this.getPreview({id, previewId, ref: true});
        if(!dataset) return;
        dataset.error = error || '';
        this.update();
    }

     /**
     * 变更属性字段类型
     */
    fieldTypeOnChange = ({id, previewId, field, value}) => {
        if(!id || !previewId || !field) return;
        const dataset = this.getPreview({id, previewId, ref: true});
        if(!dataset) return;
        dataset.fields.forEach((f) => {
            if(f.name === field.name) {
                f.type = value;
            }
        });
        this.update();
    }

    /**
     * 变更经纬度选择字段
     */
    lngLatFieldOnChange = ({id, previewId, key, value}) => {
        if(!id || !previewId || !key) return;
        const dataset = this.getPreview({id, previewId, ref: true});
        if(!dataset) return;
        if(dataset.id === previewId && dataset.geotype && dataset.geotype.indexOf(',') >= 0) {
            const lngLat = dataset.geotype.split(',');
            if(key === 'lng') {
                lngLat[0] = value;
            }
            if(key === 'lat') {
                lngLat[1] = value;
            }
            dataset.geotype = lngLat.join(',');
            return;
        }
        this.update();
    }

     /**
     * 更新字段名称
     */
    updateCRS = ({id, previewId, crs}) => {
        if(!id || !previewId || !crs) return;
        const dataset = this.getPreview({id, previewId, ref: true});
        if(!dataset) return;
        dataset.crs = crs;
        this.update();
    }

    /**
     * 更新字段名称
     */
    updateFieldName = ({id, previewId, field, value}) => {
        if(!id || !previewId || !field) return;
        const dataset = this.getPreview({id, previewId, ref: true});
        if(!dataset || !dataset.fields) return;
        dataset.fields.forEach((f) => {
            if(f.name === field.name) {
                f.name = value;
                return;
            }
        });
        this.update();
    }


    /**
     * 更新上传任务属性
     * 服务集上传完成后返回任务，立即更新任务 tasks
     * 数据集上传完成后返加预览，立即更新预览 previews
     */
    updateTask = ({id, key, value}) => {
        this.list.forEach((task) => {
            if(task && task.id === id) {
                if(key === 'previews') {
                    const cloneValue = cloneJson(value);
                    this._initDatasets(cloneValue);
                    task[key] = cloneValue;
                } else {
                    task[key] = value;
                }
                return;
            }
        });
        this.update();
    }

    /**
     * 校验初始化数据集
     */
    _initDatasets = (datasets) => {
        if(isArray(datasets)) {
            datasets.forEach((dataset) => {
                // 初始化经纬度选择字段
                if(dataset && dataset.geotype && dataset.geotype.indexOf(',') >= 0 
                    && dataset.format === '.csv') {
                    const lngLat = dataset.geotype.split(',');
                    if(!lngLat[0]) {
                        lngLat[0] = dataset.fields[0].name;
                    }
                    if(!lngLat[1]) {
                        lngLat[1] = dataset.fields[0].name;
                    }
                    dataset.geotype = lngLat.join(',');
                }
            });
        }
    }

    /**
     * 添加上传任务
     * 此方法在上传校验成功后立即调用
     */
    addTask = ({file, type}) => {
        if(!file) return;
        if(this.list.length >= MAX_TASK) {
            ToasterError({message: `最大任务限制${MAX_TASK}`});
            return;
        }
        const id = guid(true);
        this.list.unshift({
            id,
            name: getFilename(file), 
            size: getFileSize(file),
            cancel: null,
            type, // ts, dataset
            progress: '0%',
            handleProgress: null,
            status: 0, // 0:uploading, 1: uploadend, 2: cancel, 3: 正在入库中, 4: 入库完成
            error: '',
            previews: [], // 待入库
            tasks:[] // 正在执行中的远程命令
        });
        this.update();

        let url= 'datasets/upload/';

        if(type === 'ts') {
            const suffix = getFileNameExt(file.name);
            url = suffix === 'mbtiles' ? `ts/upload/` : `ts/publish/`;
        }

        ajax_upload_file_width_progress({
            url, 
            data:file, 
            setCancelToken: (c) => { 
                this.cancels[id] = c;
            },
            onUploadProgress: (e) => { 
                this.updateTask({id, key: 'progress', value:e}) 
                if(e === '100%') {
                    this.updateTask({id, key: 'status', value: 1});
                }
            }
        }).then((res) => {
            if(res && res.code === 200) {
                const data = res.data;
                // 添加数据集预览
                if(type === 'dataset') {
                    const _data = (data || []).filter(d => d).map((d) => {
                        d.progress = -1;
                        return d;
                    });
                    this.updateTask({id, key: 'previews', value: (_data || [])});
                    if(!data) {
                        this.updateTask({id, key: 'error', value: '服务器未返回数据集信息，解析异常'});
                    }
                }
                // 添加服务集任务
                if(type === 'ts' && isObject(data) && data.id) {
                    if(!data.base) data.base = id;
                    this.updateTask({id, key: 'base', value: data.base});
                    if(data.error) {
                        this.updateTask({id, key: 'error', value: data.error});
                    }
                    this.updateTask({id, key: 'handleProgress', value: null});
                    this.addHandle(data);
                    this.update({immediatelyUpdateHandle: true});
                }
                
            } else {
                this.updateTask({id, key: 'error', value: res.msg});
            }
        }).catch((err) => {
            this.updateTask({id, key: 'status', value: 2}); 
        });
    }

    /**
     * 获取远程任务
     */
    getHandle = ({id, ref}) => {
        if(!ref) {
            id && this.handles.filter(task => task.id === id)[0];
        } else {
            return getObjectFromArray(this.handles, 'id', id);
        }
    }

    /**
     * 获取目标任务
     */
    getHandleByBase = (id) => {
        return this.handles.filter(h => (h.base && h.base === id))[0];
    }

    getAllHandle = (ref) => {
        return ref ? this.handles : cloneJson(this.handles);
    }

     /**
     * 更新远程任务
     */
    updateHandle = () => {
        const ids = this.handles.filter(h => !h.error).map(h => h.id).filter(a => a).join(',');
        if(!trim(ids)) return;
        ajax_get({
            url: `tasks/info/${ids}/`
        }).then((res) => {
            if(res && res.code === 200 && isArray(res.data)) {
                this.handles = res.data;
            } else {
                ids.split(',').forEach(id => {
                    this.handles.forEach(h => {
                        if(h.id === id) {
                            h.error = res.msg;
                        }
                    })
                });
            }
            this.list.forEach((task) => {
                const handleProgress = this.getTaskProgress(task.id);
                if( task.handleProgress !== '100%' && task.progress === '100%' ) {
                    task.handleProgress = handleProgress;
                    if(task.handleProgress === '100%') {
                        task.status = 4; // 任务状态为完成
                    }
                    if(task.previews) {
                        task.previews.forEach((preview) => {
                            const handle = this.getHandleByBase(preview.id);
                            if(handle) {
                                const error = handle.error;
                                preview.progress = error ? -1 : handle.progress || 0;
                                preview.error = handle.error;
                            }
                        });
                    } else {
                        const handle = this.getHandleByBase(task.base);
                        if(handle) {
                            task.error = handle.error;
                        }
                    }
                    if(handleProgress === '100%' ) {
                        const cbs = this.callbacks;
                        for(const key in cbs) {
                            if(cbs[key] && isFunction(cbs[key])) {
                                try{
                                    cbs[key]();
                                } catch{ }
                            }
                        }
                    }
                } 
                
            });
            this.handles = res.data.filter(h => h.progress !== 100);
            
            this.update();
        }).catch((err) => {
            this.update();
        });
    }

    /**
     * 添加远程任务
     */
    addHandle = ({id, base, type, name, error}) => {
        const handle = this.getHandle(id);
        if(!handle) {
            this.handles.unshift({
                id,
                base,
                type, // dsimport, tsimport
                name,
                error,
                progress: 0,
            });
        }
    }

    removeErrorTask = () => {
        this.list = this.list.filter(t => !t.error);
        this.update();
    }

    removeEndTask = () => {
        this.list = this.list.filter(t => 
            (t.type === 'dataset' && t.handleProgress !== '100%') 
            || (t.type === 'ts' && t.handleProgress === null)
        );
        this.update();
    }

    removeUploadingTask = () => {
        this.list.forEach((task) => {
            if(isFunction(this.cancels[task.id])) {
                this.cancels[task.id](task.name);
            }
        });
        this.list = this.list.filter(t => t.progress === '100%');
        this.update();
    }

    hasWaitingHandleTask = () => {
        let result = false;
        this.list.forEach((task) => {
            task.previews.forEach((p) => {
                if(p.progress === -1) {
                    result = true;
                }
            })
        });
        return result;
    }

    /**
     * 清除待处理任务
     */
    removeWatingHandleTask = () => {
        this.list.forEach((task) => {
            task.previews = task.previews.filter(p => p.progress !== -1);
        });
        this.list = this.list.filter(t => t.previews.length !== 0);
        this.update();
    }

    /**
     * 任务是否可以删除
     */
    taskCanRemove = (id) => {
        let result = true;
        const task = this.getTask(id);
        if(!task) return true;
        // 是否存在数据集导入任务
        if(task.type=== 'dataset' && task.previews && task.previews.length > 0) {
            task.previews.forEach(p => {
                if(p.progress >= 0 && p.progress < 100) {
                    result = false;
                    return;
                }
            });
        }
        // 服务集任务是否正在导入
        if(task.type === 'ts' ) {
            const handle = this.getHandleByBase(task.base);
            result = !!(handle && handle.error) || (task.progress !== '100%' && !task.error) || !!task.error;
        }
        return result;
    }


    /**
     * 清除所有任务
     */
    clear = () => {
        this.list = [];
        this.handles = [];
        this.cancels = {};
        this.update();
    }

}

export const taskHelper = new TaskHelper();