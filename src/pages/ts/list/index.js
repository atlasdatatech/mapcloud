// 我的服务集 + 公开的服务集
import {Component} from 'react';
import classNames from 'classnames';
import styles from './index.less';
import layoutStyles from '../../../styles/common/mainLayout.less';
import {HelpListComponent} from '../../../components/Help';
import { SpanIcon, ExIcon, IconText } from '../../../components/common';
import ListHelper from '../../../components/ListHelper';
import {EditableWithHandle} from '../../../components/controls/Input';
import BlankCreate from '../../../components/BlankCreate';
import { ButtonGroup, Button, Popover, Position, Divider, Card, Elevation, Icon, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import CreateTilesetByUpload from '../components/CreateTilesetByUpload';
import Pagination from '../../../components/Pagination';
import CreateTilesetByExsitDataset from '../components/CreateTilesetByExsitDataset';
import router from 'umi/router';
import Local from '../../../utils/local';
import {ajax_get, ajax_post} from '../../../utils/ajax';
import {superbytes} from '../../../utils/file';
import { sort } from '../../../utils/util';
import dayjs from 'dayjs';
import DeleteAlert from '../../../components/modals/DeleteModal';
import Toaster, {ToasterError} from '../../../components/Toaster';
import {PAGE_SIZE} from '../../../const/core';
import {taskHelper} from '../../../utils/task';

export default class TilesetList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openCreateMenu: false, // 创建MENU
            openCreateTilesetByUploadModal: false, // 上传创建窗口
            openCreateTilesetByExistDatasetModal: false, // 从数据集创建
            currentTileset: null, // 当前服务集
            filterKey: '', // 过滤关键词
            sortKey: 'updated_at', // 更新字段
            sortOrder: 'desc', // 排序
            searchKey: '', // 搜索关键词 
            showDeleteModal: false, // 删除对话框
            tilesets: [],
            datasets: [],
            loaded: false,

            pageCurrent: 1,
            total: 0,
        }
    }

    toggleOpenCreateMenu = () => {
        const {openCreateMenu} = this.state;
        this.setState({openCreateMenu: !openCreateMenu});
    }

    /**
     * 打开或关闭上传数据集创建服务集
     * @param {Boolean} state
     */
    handleCreateTilesetByUploadModal = (state) =>{
        this.setState({openCreateTilesetByUploadModal: state});
        if(state) this.toggleOpenCreateMenu();
    }

    /**
     * 打开或关闭从已有数据源选择创建服务集
     * @param {Boolean} state
     */
    handleCreateTilesetByExistDatasetModal = (state) =>{
        this.setState({openCreateTilesetByExistDatasetModal: state});
        if(state) this.toggleOpenCreateMenu();
    }

    componentDidMount() {
        this.updateList();
        taskHelper.setCallback({type: 'updateTs',fn: this.updateList});
    }

    // 切换排序方式
    toggleSortOrder = () => {
        const {sortOrder} = this.state;
        this.setState({sortOrder: (sortOrder === 'asc' ? 'desc' : 'asc')});
    }

    handlePageChange = (page) => {
        this.setState({pageCurrent: page});
        setTimeout(() => {
            this.updateList();
        }, 200);
    }

    updateList = () => {
        const { searchKey, sortKey, sortOrder, pageCurrent } = this.state;
        const params = {};
        if(searchKey) {
            params.keyword = searchKey;
        }
        if(sortKey && sortOrder) {
            params.order = `${sortKey} ${sortOrder}`;
        }
        params.start = (pageCurrent - 1 )* PAGE_SIZE.tileset;
        params.rows = PAGE_SIZE.tileset;
         ajax_get({
             url:`ts/`, 
             data: params,
         }).then((res) => {
             if(res && res.code === 200 && res.data) {
                 this.setState({tilesets: res.data.list, total: res.data.total, loaded: true});
             } else {
                 this.setState({tilesets: [],total: 0});
             }
         }); 
    }

    // 删除
    _deleteHandler = () => {
        const {currentTileset} = this.state;
        if(currentTileset) {
            const user = Local.get('name');
            ajax_post({
                url:`ts/delete/${currentTileset.id}/`, 
            }).then((res) => {
                if(res && res.code === 200) {
                    this.setState({currentTileset: null});
                    this.updateList();
                }else {
                    Toaster.show({message: '删除错误，' +　res.msg, intent:'danger', icon:'error'});
                }
                this.setState({showDeleteModal: false})
            }); 
        } else {
            this.setState({showDeleteModal: false})
        }
    }

    // 获取数据集
    handleCreateTilesetByExistDataset =() =>{
        ajax_get({url:`datasets/`}).then((res) => {
            if(res && res.code === 200 && res.data) {
                this.setState({
                    datasets: res.data.list, 
                    openCreateMenu: false,
                    openCreateTilesetByExistDatasetModal: true
                });
            }
        });
    }

    toDetail = (id) => {
        if(id) {
            router.push('/ts/detail/' + id);
        }
    }

    updateTileset = ({id, name}) => {
        if(!id) return;
        const {tilesets} = this.state;
        if(tilesets && tilesets.length > 0) {
            tilesets.forEach((ts) => {
                if(id === ts.id) {
                    ts.name = name;
                }
            });
            this.setState({tilesets});
        }
    }

    saveTileset = (id) => {
        if(!id) return;
        const {tilesets} = this.state;
        if(tilesets && tilesets.length > 0) {
            const tileset = tilesets.filter(ts => ts.id === id)[0];
            if(tileset) {
                ajax_post({url:`ts/info/${id}/`, data: tileset}).then((res) => {
                    if(res && res.code === 200) {

                    } else {
                        ToasterError({message:'更新服务集信息失败'});
                    }
                });
            }
        }
    }

    render() {
        const {openCreateMenu, loaded,
                filterKey, sortKey, searchKey, sortOrder, 
              openCreateTilesetByExistDatasetModal, 
              openCreateTilesetByUploadModal} = this.state;
        
        const tilesets = this.state.tilesets
        .filter(d => d.name.toLocaleLowerCase().indexOf(filterKey.toLocaleLowerCase()) >= 0)
        .sort(sort({key: sortKey, order: sortOrder}));

        let CreateTilesetMenu = (
            <Menu>
                <MenuItem icon='upload' text='上传创建' onClick={() => {this.handleCreateTilesetByUploadModal(true);}}>
                </MenuItem>
                <MenuDivider />
                <MenuItem icon='folder-shared-open' text='选择已有数据集' 
                    onClick={this.handleCreateTilesetByExistDataset}></MenuItem>
            </Menu>
        );

        const sortOptions = [
            {label:'更新时间', value:'updated_at'},
            {label:'创建时间', value:'created_at'},
            {label:'名称', value:'name'},
            {label:'大小', value:'size'},
            // {label:'文件类型', value:'format'},
        ];

        return (
            <div className="clearfix">
                <div className={classNames(layoutStyles.main)}>
                    <div className={classNames("row")}>
                        <div className="columns six"><h2><IconText icon="box" iconSize={20} text="我的服务集" /></h2></div>
                        <div className="columns six text-right"></div>
                    </div>
                    <div className={classNames(styles.mapForm, "flex-vertical")}>
                        <div>
                            <ListHelper
                                searchKey = {searchKey}
                                searchKeyOnChange = {(value) => { this.setState({searchKey: value}) }}
                                searchHandler = {this.updateList}
                                clearSearchKey = {() => {
                                    this.setState({searchKey: ''});
                                    this.updateList();
                                }}

                                filterKey = {filterKey}
                                filterKeyOnChange = {(value) => { this.setState({filterKey: value}) }}

                                sortOptions = {sortOptions}
                                sortKey = {sortKey}
                                sortKeyOnChange = {(v) => {this.setState({sortKey: v});}}

                                sortOrder = {sortOrder}
                                sortOrderChange = {this.toggleSortOrder}
                                updateHandler = {this.updateList}
                            />
                        </div>
                        <div className="">
                            <Popover content={CreateTilesetMenu} position={Position.BOTTOM_LEFT}>
                                    <Button intent="primary" 
                                        fill="true" large="true" 
                                        icon = 'folder-new'
                                        rightIcon='caret-down'
                                        onClick={this.toggleOpenCreateMenu}
                                        className={styles.createButton}>
                                        创建服务集
                                    </Button>
                                </Popover>
                        </div>
                    </div>
                    <div className="pt-5 mgb-5">
                        <ul className={classNames(styles.list, 'at-dataset-list')}>
                            {tilesets.length > 0 && tilesets.map((ds, index) => {
                                return (
                                    <li key={index}>
                                        <div onClick={() => {this.toDetail(ds.id)}} className="">
                                            {/* <img src={ds.thumbnail || './images/thumbnail.svg'} /> */}
                                            {ds.thumbnail ? <img src={ds.thumbnail} /> : 
                                                <Icon icon="box" iconSize={32} color={'#9aa'} />}
                                                <div title={ds.format} className="text-overflow">{ds.format}</div>
                                        </div>
                                        <div>
                                            <div className={styles.editTitle}>
                                                <EditableWithHandle value={ds.name} onChange={(e) => {
                                                    this.updateTileset({id: ds.id, name: e})
                                                }} saveHandle = {() => {this.saveTileset(ds.id)}} />
                                            </div>
                                            <div className={classNames(styles.item, 'flex-vertical')}>
                                                <div>
                                                    <span style={{marginRight: '20px'}}>{superbytes(ds.size)}</span>
                                                    {ds.tag && <span style={{marginRight: '20px'}}>标签分类：{ds.tag}</span>}
                                                    <span style={{marginRight: '20px'}}>最后更新：{
                                                        dayjs(ds.updated_at).format('YYYY-MM-DD HH:mm')
                                                        }
                                                    </span>
                                                </div>
                                                <div className="text-right disable-user-select">
                                                    <ButtonGroup minimal={true}>
                                                        <Button icon='eye-open' text="查看详情" 
                                                            title="详情" 
                                                            onClick={() => {this.toDetail(ds.id)}}>
                                                            </Button>
                                                        <Button icon='trash' text='删除' title="删除" onClick={() => {
                                                            this.setState({currentTileset: ds, showDeleteModal: true});
                                                        }}></Button>
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                        {tilesets.length === 0 && loaded && <BlankCreate desc="没有服务集，赶快创建一个吧" />}
                    </div>
                    <div className="">
                        <Pagination 
                            pageSize = {PAGE_SIZE.tileset}
                            current = {this.state.pageCurrent}
                            onChange = {this.handlePageChange} 
                            total = {this.state.total} />
                    </div>
                </div>
                <div className={classNames(layoutStyles.side, 'pd-2 at-side')}>
                    <Card interactive={true} elevation={Elevation.THREE}>
                        <HelpListComponent type='TILESET' />
                    </Card>
                </div>
                
                {openCreateTilesetByUploadModal && <CreateTilesetByUpload
                    openCreateTilesetByUploadModal = {openCreateTilesetByUploadModal}
                    handleCreateTilesetByUploadModal = {this.handleCreateTilesetByUploadModal}
                    uploadedHandler = {this.updateList}
                />}

                {openCreateTilesetByExistDatasetModal && <CreateTilesetByExsitDataset
                    datasets = {this.state.datasets}
                    updateHandler = {this.updateList}
                    openCreateTilesetByExistDatasetModal = {openCreateTilesetByExistDatasetModal}
                    handleCreateTilesetByExistDatasetModal = {this.handleCreateTilesetByExistDatasetModal}
                />}

                {this.state.showDeleteModal && <DeleteAlert 
                    desc='确定要删除此服务集吗？删除后将无法恢复，并影响关联的地图与应用'
                    isOpen={this.state.showDeleteModal}
                    cancelHandler={() => { this.setState({showDeleteModal: false}) }} 
                    confirmHandler={this._deleteHandler} 
                    >
                </DeleteAlert>}
            </div>
        )
    }

};