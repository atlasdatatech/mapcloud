// 我的地图 + 公开的地图
import { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import layoutStyles from '../../../styles/common/mainLayout.less';
import {HelpListComponent} from '../../../components/Help';
import {IconText} from '../../../components/common';
import BlankCreate from '../../../components/BlankCreate';
import { ButtonGroup, Button, Popover, Position, Divider, Icon,
    Card, Elevation, Callout, Menu, MenuItem, MenuDivider,Spinner } from "@blueprintjs/core";
import CreateMapByTemplateModal from '../components/CreateMapByTemplate';
import CreateMapByUploadModal from '../components/CreateMapByUpload';
import ListHelper from '../../../components/ListHelper';
import {ajax_get, ajax_post, getHost} from '../../../utils/ajax';
import {superbytes} from '../../../utils/file';
import { sort } from '../../../utils/util';
import dayjs from 'dayjs';
import router from 'umi/router';
import DeleteAlert from '../../../components/modals/DeleteModal';
import Toaster, {ToasterSuccess, ToasterError} from '../../../components/Toaster';
import MapCard from '../components/MapCard';
import { saveAs } from 'file-saver';
import Local from '../../../utils/local';
import ShareModal from '../../../components/modals/Share';
import { getMapViewLink, getDevLink} from '../../../utils/link';
import Pagination from '../../../components/Pagination';
import {PAGE_SIZE} from '../../../const/core';

export default class MapList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openCreateMapByTemplateModal: false, // 打开模板创建
            openCreateMapByUploadModal: false, // 打开上传创建
            showWelcomeNotice: true,
            filterKey: '', // 过滤关键词
            sortKey: 'created_at', // 更新字段, updated_at
            sortOrder: 'desc', // 排序
            searchKey: '', // 搜索关键词 
            showDeleteModal: false, // 删除对话框
            currentDataset: null, // 当前数据集
            loaded: false,
            currentMap: null,
            myMaps: [],
            myMapsCount: 0,
            publicMaps: [],
            publicMapsCount: 0,
            uploadType: 'create', // create, replace
            showShareModal: false,
            
            pageCurrent: 1,
            publicType: 'all',
        }
    }

    /**
     * 打开或关闭模板创建地图对话框
     * @param {Boolean} isOpen 是否打开
     */
    handleCreateMapByTemplateModal = (isOpen) => {
        this.setState({openCreateMapByTemplateModal: isOpen});
    }

    /**
     * 打开或关闭上传样式创建地图对话框
     * @param {Boolean} isOpen 是否打开
     */
    handleCreateMapByUploadModal = (isOpen) => {
        this.setState({openCreateMapByUploadModal: isOpen});
    }

    componentDidMount() {
        this.updateList();
        this.updatePublicList();
    }

    toggleSortOrder = () => {
        const {sortOrder} = this.state;
        this.setState({sortOrder: (sortOrder === 'asc' ? 'desc' : 'asc')});
    }

    updatePublicList = () => {
        ajax_get({
            url:`maps/`, 
            data: {public: true},
        }).then((res) => {
            if(res && res.code === 200 && res.data) {
                this.setState({
                    publicMaps: res.data.list, 
                    publicMapsCount: res.data.total
                });
            } else {
                ToasterError({message:'获取公共地图失败: ' + res.msg});
                this.setState({publicMaps: [], publicMapsCount: 0});
            }
        }); 
    }

    handlePageChange = (page) => {
        this.setState({pageCurrent: page});
        setTimeout(() => {
            this.updateList();
        }, 200);
    }

    // 更新数据集列表
    updateList = () => {
        const { searchKey, sortKey, sortOrder, pageCurrent, publicType } = this.state;
        const params = {};
        if(searchKey) {
            params.keyword = searchKey;
        }
        if(sortKey && sortOrder) {
            params.order = `${sortKey} ${sortOrder}`;
        }
        if(publicType !== 'all') {
            params.public = publicType === 'public' ? true : false;
        }
        params.start = (params.public !== undefined ? 0 : pageCurrent - 1 )* PAGE_SIZE.map;
        params.rows = PAGE_SIZE.map;
        ajax_get({
            url:`maps/`, 
            data: params,
        }).then((res) => {
            if(res && res.code === 200 && res.data) {
                this.setState({
                    myMaps: res.data.list, 
                    loaded: true,
                    myMapsCount: res.data.total
                });
            } else {
                this.setState({myMaps: [], myMapsCount:0, loaded: true});
                ToasterError({message:'获取地图列表失败: ' + res.msg});
            }
            this.setState({currentMap: null, uploadType: 'create'});
        }); 
    }

    /**
     * 删除地图操作
     */
    _deleteHandler = () => {
        const {currentMap} = this.state;
        if(!currentMap) return;
        ajax_post({url: `maps/delete/${currentMap.id}/`}).then((res) => {
            if(res && res.code === 200) {
                this.updateList();
                this.setState({currentMap: null, showDeleteModal: false});
            }
        });
    }

    operateHandler = ({type, map}) => {
        this.setState({currentMap: map});
        // 删除
        if(type === 'edit' && map) {
            router.push(`/map/edit/${map.id}`);
        }
        // 删除
        if(type === 'delete' && map) {
            this.setState({showDeleteModal: true});
        }
        // 分享
        if(type === 'share' && map) {
            this.setState({showShareModal: true});
        }
        // 复制
        if(type === 'clone') {
            ajax_get({url: `maps/${type}/${map.id}/`}).then((res) => {
                if(res && res.code === 200 && res.data) {
                    this.updateList();
                    Toaster.show({
                        message:'已成功复制为：' + res.data.name, 
                        icon: 'duplicate', 
                        intent:'success'
                    });
                } else {
                    Toaster.show({message: res.msg, icon:'error', intent:'danger'});
                }
            })
        }
        if(type === 'replace') {
            this.setState({uploadType: 'replace'});
            this.handleCreateMapByUploadModal(true);
        }
        // 公开或私有
        if(type === 'private' || type === 'public') {
            ajax_post({url: `maps/${type}/${map.id}/`}).then((res) => {
                if(res && res.code === 200) {
                    this.updateList();
                } else {
                    Toaster.show({message: res.msg, icon:'error', intent:'danger'});
                }
            })
        }
        // 下载
        if(type === 'download') {
            saveAs(`${getHost()}maps/${type}/${map.id}/?access_token=${Local.getAccessToken()}`);
        }
    }

    handlerBlankMap = () => {
        ajax_post({url:`maps/create/`}).then((res) => {
            if(res && res.code === 200) {
                router.push(`/map/edit/${res.data.id}`);
            } else {
                ToasterError({msg: '创建失败：' + res.msg});
            }
        })
    }

    render() {
        const {
            publicMaps, // 公开的地图模板
            showWelcomeNotice,  // 显示欢迎信息
            currentMap,  // 当前地图
            showDeleteModal,  // 显示删除
            showShareModal, // 显示分享
            filterKey,  // 过滤
            sortKey, 
            searchKey, 
            sortOrder, 
            loaded,
            openCreateMapByTemplateModal, 
            openCreateMapByUploadModal,
            publicType,
        } = this.state;
        const myMaps = (this.state.myMaps || [])
            .filter(d => d.name.toLocaleLowerCase().indexOf(filterKey.toLocaleLowerCase()) >= 0)
            .sort(sort({key: sortKey, order: sortOrder}));
        

        let CreateMapMenu = (
            <Menu>
                <MenuItem icon="paperclip" text="使用模板" 
                    onClick={() => { this.handleCreateMapByTemplateModal(true); }}>
                </MenuItem>
                <MenuDivider />
                <MenuItem icon="map" text="空白地图" 
                    onClick={() => { this.handlerBlankMap(); }}>
                </MenuItem>
                <MenuItem icon="upload" text="上传地图样式" 
                    onClick={() => { this.handleCreateMapByUploadModal(true); }}>
                </MenuItem>
            </Menu>
        );
 
        let viewLink = getMapViewLink(currentMap && currentMap.id);

        const sortOptions = [
            {label:'更新时间', value:'updated_at'},
            {label:'创建时间', value:'created_at'},
            {label:'名称', value:'name'},
        ];

        return (
            <div className="clearfix">
                <div className={classNames(layoutStyles.main)}>
                    {
                        showWelcomeNotice && 
                        <Callout intent='primary' icon={'endorsed'} className={classNames(styles.welcome, 'mgb-1')}>
                            欢迎体验舆图数据推出的全新地图云在线应用，发布地图 So easy，
                            <a href={getDevLink('guide/5')} target="_blank">5分钟快速入门</a>
                        </Callout>
                    }
                    <div className="mgb-8">
                        <div className={classNames("row")}>
                            <div className="columns six">
                                <div className='flex-vertical'>
                                    <Icon icon='map' iconSize={30} /><h3 className="pl-2"> 我的地图</h3>
                                </div>
                            </div>
                        </div>
                        <div className={classNames(styles.mapForm, "flex-vertical")}>
                            <div>
                                <ListHelper
                                    searchKey = {searchKey}
                                    searchKeyOnChange = {(v) => { this.setState({searchKey: v}) }}
                                    searchHandler = {this.updateList}
                                    clearSearchKey = {() => {
                                        this.setState({searchKey: ''});
                                        this.updateList();
                                    }}

                                    filterKey = {filterKey}
                                    filterKeyOnChange = {(v) => { this.setState({filterKey: v}) }}

                                    sortOptions = {sortOptions}
                                    sortKey = {sortKey}
                                    sortKeyOnChange = {(v) => {this.setState({sortKey: v});}}

                                    sortOrder = {sortOrder}
                                    sortOrderChange = {this.toggleSortOrder}
                                    updateHandler = {this.updateList}

                                    publicType = {publicType}
                                    publicOnChange = {(v) => {this.setState({publicType: v});}}
                                />
                            </div>
                            <div>
                                <Popover content={CreateMapMenu} position={Position.BOTTOM_LEFT}>
                                    <Button intent="primary"
                                        icon="map-create" 
                                        text="新建地图" 
                                        fill="true" 
                                        large="true" 
                                        rightIcon='caret-down'
                                        className={styles.createButton}>
                                    </Button>
                                </Popover>
                            </div>
                        </div>
                        <div className="pt-5 mgb-5" style={{minHeight: '350px'}}>
                            <ul className={classNames(styles.list, 'at-map-list')}>
                                {myMaps.map((map, index) => {
                                    return (
                                        <li key={index} className='at-card-wrapper'>
                                            <MapCard map={map} operateHandler={this.operateHandler} />
                                        </li>
                                    )
                                })}
                            </ul>
                            {!loaded && <div className="mgt-5 mgb-5"><Spinner size={40} intent='primary' /></div>}
                            {
                                myMaps.length === 0  && loaded && <BlankCreate desc="您还没有地图，赶快创建一个吧" />
                            }
                        </div>
                        <div className="">
                            <Pagination 
                                pageSize = {PAGE_SIZE.map}
                                current = {this.state.pageCurrent}
                                onChange = {this.handlePageChange} 
                                total = {this.state.myMapsCount} />
                        </div>
                    </div>
                    <div>
                        <div className={classNames("row")}>
                            <div className="columns six">
                                <div className='flex-vertical'>
                                    <Icon icon='globe' iconSize={30} /><h3 className="pl-2"> 地图云公共地图</h3>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <ul className={classNames(styles.list)}>
                                {publicMaps.map((map, index) => {
                                    return (
                                        <li key={index} className='at-card-wrapper'>
                                            <MapCard isPublic={true} map={map} operateHandler={this.operateHandler} />
                                        </li>
                                    )
                                })}
                            </ul>
                            {
                                publicMaps.length === 0  && loaded && <BlankCreate desc="还没有公共地图" />
                            }
                        </div>
                    </div>
                </div>
                <div className={classNames(layoutStyles.side, 'pd-2 at-side')}>
                    
                    <Card interactive={true} elevation={Elevation.THREE}>
                        <HelpListComponent type='MAP' />
                    </Card>
                </div>
                {/* 根据模板创建地图对话框 */}
                {openCreateMapByTemplateModal && <CreateMapByTemplateModal 
                    openCreateMapByTemplateModal = {openCreateMapByTemplateModal}
                    templates = {publicMaps}
                    handleCreateMapByTemplateModal = {this.handleCreateMapByTemplateModal}
                />
                }
                {/* 上传地图样式创建地图对话框 */}
                {openCreateMapByUploadModal && <CreateMapByUploadModal
                    updateList = {this.updateList}
                    type = {this.state.uploadType}
                    map = {this.state.currentMap}
                    isOpen = {openCreateMapByUploadModal}
                    onCancel = {this.handleCreateMapByUploadModal}
                />}

                {showDeleteModal && <DeleteAlert 
                    desc='确定要删除此地图吗？删除后将无法恢复'
                    isOpen={showDeleteModal}
                    cancelHandler={() => { this.setState({showDeleteModal: false}) }} 
                    confirmHandler={this._deleteHandler} 
                    >
                </DeleteAlert> }

                {showShareModal && <ShareModal title='分享地图' 
                    isOpen={showShareModal} 
                    handleClose = {() => { this.setState({showShareModal: false}) }}
                    url={viewLink} /> 
                }
            </div>
        )
    }

};