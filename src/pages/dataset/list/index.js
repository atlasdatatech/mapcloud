import { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import layoutStyles from '../../../styles/common/mainLayout.less';
import { HelpListComponent } from '../../../components/Help';
import { SpanIcon, ExIcon, IconText } from '../../../components/common';
import ListHelper from '../../../components/ListHelper';
import {EditableWithHandle} from '../../../components/controls/Input';
import { ButtonGroup, Button, Popover, Position, Divider, Card, Elevation, Menu, MenuItem, Spinner } from "@blueprintjs/core";
import BlankCreate from '../../../components/BlankCreate';
import CreateDatasetModal from '../components/CreateDatasetModal';
import Local from '../../../utils/local';
import {ajax_get, ajax_post} from '../../../utils/ajax';
import {superbytes} from '../../../utils/file';
import { sort } from '../../../utils/util';
import dayjs from 'dayjs';
import router from 'umi/router';
import DeleteAlert from '../../../components/modals/DeleteModal';
import Pagination from '../../../components/Pagination';
import {PAGE_SIZE} from '../../../const/core';
import {getIcon} from '../../../utils/icon';
import {getLayerTypeByGeometryType}  from '../../../utils/map';
import {taskHelper} from '../../../utils/task';


export default class DatasetList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openCreateMenu: false, // 打开创建窗口
            openCreateDatasetModal: false, // 打开或关闭创建数据集窗口
            datasets: [], // 数据集列表
            filterKey: '', // 过滤关键词
            sortKey: 'updated_at', // 更新字段
            sortOrder: 'desc', // 排序
            searchKey: '', // 搜索关键词 
            showDeleteModal: false, // 删除对话框
            currentDataset: null, // 当前数据集
            loaded: false,

            total: 0,
            pageCurrent: 1,

            fieldTypes: [],
            encodings: [],
            crss: [],
        }
    }

    /**
     * 打开或关闭创建数据集窗口
     * @param {Boolean} state 打开或关闭
     */
    handleCreateDatasetModal = (state) => {
        this.setState({openCreateDatasetModal: state});
    }

    handlePageChange = (page) => {
        this.setState({pageCurrent: page});
        setTimeout(() => {
            this.updateList();
        }, 200);
    }

    // 更新数据集列表
    updateList = () => {
        const { searchKey, sortKey, sortOrder, pageCurrent } = this.state;
        const params = {};
        if(searchKey) {
            params.keyword = searchKey;
        }
        if(sortKey && sortOrder) {
            params.order = `${sortKey} ${sortOrder}`;
        }
        params.start = (pageCurrent - 1 )* PAGE_SIZE.dataset;
        params.rows = PAGE_SIZE.dataset;
        ajax_get({
            url:`datasets/`,
            data: params, 
        }).then((res) => {
            if(res && res.code === 200 && res.data) {
                this.setState({datasets: res.data.list, loaded: true});
            } else {
                this.setState({datasets: []});
            }
        }); 
    }

    componentDidMount() {
        this.updateList();
        ajax_get({url: 'ftype/'}).then((res) => {
            this.setState({
                fieldTypes: (res.data || []).filter(d => d),
            })
        });
        ajax_get({url: 'encoding/'}).then((res) => {
            this.setState({
                encodings: (res.data || []).filter(d => d),
            })
        });
        ajax_get({url: 'crs/'}).then((res) => {
            this.setState({
                crss: (res.data || []).filter(d => d),
            });
        });
        taskHelper.setCallback({type: 'updateDataset',fn: this.updateList});
    }
    /**
     * 切换创建菜单可见
     */
    toggleOpenCreateMenu = () => {
        const {openCreateMenu} = this.state;
        this.setState({openCreateMenu: !openCreateMenu });
    }

    // 删除
    _deleteHandler = () => {
        const {currentDataset} = this.state;
        if(currentDataset) {
            const user = Local.get('name');
            ajax_post({
                url:`datasets/delete/${currentDataset.id}/`, 
            }).then((res) => {
                if(res && res.code === 200) {
                    this.setState({currentDataset: null});
                    this.updateList();
                }
                this.setState({showDeleteModal: false})
            }); 
        } else {
            this.setState({showDeleteModal: false})
        }
    }

    // 切换排序方式
    toggleSortOrder = () => {
        const {sortOrder} = this.state;
        this.setState({sortOrder: (sortOrder === 'asc' ? 'desc' : 'asc')});
    }

    updateDataset = ({id, name}) => {
        if(!id) return;
        const {datasets} = this.state;
        if(datasets && datasets.length > 0) {
            datasets.forEach((ds) => {
                if(id === ds.id) {
                    ds.name = name;
                }
            });
            this.setState({datasets});
        }
    }

    saveDataset = (id) => {
        if(!id) return;
        const {datasets} = this.state;
        if(datasets && datasets.length > 0) {
            const dataset = datasets.filter(ds => ds.id === id)[0];
            if(dataset) {
                ajax_post({url:`datasets/info/${id}/`, data: dataset}).then((res) => {
                    if(res && res.code === 200) {

                    } else {
                        ToasterError({message:'更新服务集信息失败'});
                    }
                });
            }
        }
    }

    render() {
        const { openCreateDatasetModal, openCreateMenu, 
            filterKey, sortKey, searchKey, sortOrder,loaded, fieldTypes, encodings, crss} = this.state;
        
        const datasets = this.state.datasets
            .filter(d => d.name.toLocaleLowerCase().indexOf(filterKey.toLocaleLowerCase()) >= 0)
            .sort(sort({key: sortKey, order: sortOrder}));
        
        const createDatasetMenu = (
            <Menu>
                <MenuItem 
                    icon = 'upload'
                    onClick={
                    () => {this.handleCreateDatasetModal(true); this.toggleOpenCreateMenu(); }}
                    text='上传数据集' />
                {/* <Divider /> */}
                {/* <MenuItem onClick={() => {}} text={<SpanIcon icon='&#xe62b;' text='空白数据集' />} />  */}
            </Menu>
        );

        const sortOptions = [
            {label:'更新时间', value:'updated_at'},
            {label:'创建时间', value:'created_at'},
            {label:'名称', value:'name'},
            {label:'大小', value:'size'},
            {label:'文件类型', value:'format'},
        ];
        

        return (
            <div className="clearfix">
                <div className={classNames(layoutStyles.main)}>
                    <div className={classNames("row")}>
                        <div className="columns six"><h2><IconText icon="database" iconSize={20} text="我的数据集" /></h2></div>
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
                            <Popover content={createDatasetMenu} position={Position.BOTTOM}>
                                    <Button intent="primary" 
                                        fill="true" large="true" 
                                        icon = 'new-object'
                                        rightIcon='caret-down'
                                        onClick={this.toggleOpenCreateMenu}
                                        className={styles.createButton}>
                                        新建数据集
                                    </Button>
                            </Popover>
                        </div>
                    </div>
                    <div className="pt-5 mgb-5">
                        <ul className={classNames(styles.list, 'at-dataset-list')}>
                            {datasets.map((ds, index) => {
                                return (
                                    <li key={index}>
                                        <div className="flex-vertical-center">
                                            {/* <img src={ds.thumbnail || './images/thumbnail.svg'} /> */}
                                            {getIcon({type: getLayerTypeByGeometryType(ds.geotype), iconSize: 28})}
                                        </div>
                                        <div>
                                            <div className={styles.editTitle}>
                                                <EditableWithHandle value={ds.name} onChange={(e) => {
                                                    this.updateDataset({id: ds.id, name: e})
                                                }} saveHandle = {() => {this.saveDataset(ds.id)}} />
                                            </div>
                                            <div className={classNames(styles.item, 'flex-vertical')}>
                                                <div>
                                                    <span style={{marginRight: '20px'}}>{superbytes(ds.size)}</span>
                                                    {ds.tag && <span style={{marginRight: '20px'}}>标签分类：{ds.tag}</span>}
                                                    <span style={{marginRight: '20px'}}>最后更新：{
                                                        dayjs(ds.updated_at).format('YYYY-MM-DD HH:mm')
                                                        }
                                                    </span>
                                                    <span style={{marginRight: '20px'}}>文件类型：{ds.format}
                                                    </span>
                                                </div>
                                                <div className="text-right disable-user-select">
                                                    <ButtonGroup minimal={true}>
                                                        <Button icon='eye-open'
                                                            text='查看详情' 
                                                            title="详情" onClick={() => {
                                                            router.push('/dataset/detail/' + ds.id)
                                                            }}>
                                                        </Button>
                                                        <Button icon='trash' title="删除" text='删除' onClick={() => {
                                                            this.setState({currentDataset: ds, showDeleteModal: true});
                                                        }}>
                                                        </Button>
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                        {!loaded && <div className="mgt-3"><Spinner size={40} intent='primary' /></div>}
                        {datasets.length === 0 && loaded && <BlankCreate desc="没有数据集，赶快创建一个吧" />}
                    </div>
                    <div className="">
                        <Pagination 
                            pageSize = {PAGE_SIZE.dataset}
                            current = {this.state.pageCurrent}
                            onChange = {this.handlePageChange} 
                            total = {this.state.total} />
                    </div>
                </div>
                <div className={classNames(layoutStyles.side, 'pd-2 at-side')}>
                    <Card interactive={true} elevation={Elevation.THREE}>
                        <HelpListComponent type='DATASET' />
                    </Card>
                </div>

                {openCreateDatasetModal 
                    && fieldTypes.length > 0 
                    && encodings.length > 0 
                    && crss.length > 0 
                    && <CreateDatasetModal 
                    fieldTypes = {fieldTypes}
                    encodings = {encodings}
                    crss = {crss}
                    handleCreateDatasetModal = {this.handleCreateDatasetModal}
                    uploadedHandler = {this.updateList}
                    isOpen = {openCreateDatasetModal}
                />}

                {this.state.showDeleteModal && <DeleteAlert 
                    desc='确定要删除此数据集吗？删除后将无法恢复，并影响关联的地图与应用'
                    isOpen={this.state.showDeleteModal}
                    cancelHandler={() => { this.setState({showDeleteModal: false}) }} 
                    confirmHandler={this._deleteHandler} 
                    >
                </DeleteAlert>}
                
            </div>
        )
    }

};