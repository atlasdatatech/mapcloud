import { Component } from 'react';
import classNames from 'classnames';
import styles from './AddSource.less';
import { Button, Divider, Tab, Tabs, Icon, Checkbox } from "@blueprintjs/core";
import ScrollWrapper from '../../../../components/ScrollWrapper';
import Modal from '../../../../components/modals/BaseModal';
import { ExIcon } from '../../../../components/common';
import Pagination from '../../../../components/Pagination';
import { SearchInput } from '../../../../components/controls/Input';
import SourceCollapse from './SourceCollapse';
import BlankCreate from '../../../../components/BlankCreate';
import { ajax_get } from '../../../../utils/ajax';
import {PAGE_SIZE} from '../../../../const/core';
import dayjs from 'dayjs';
import {I18_PARAMS} from '../../../../const/i18';
import {getObjectFromArray, isEmptyObject} from '../../../../utils/util';
import {getLayerTypeByGeometryType}  from '../../../../utils/map';
import {getIcon}  from '../../../../utils/icon';
import PUBLIC_MAPS from '../../../../map/basemap';



function SelectedItem(props) {
    const {deleteSelected} = props;
    let icon = 'database';
    if(props.type === 'tileset') {icon='box'};
    return (
        <div className={classNames(styles.selectedItem, 'flex-vertical')}>
            <div>
                <div>
                    {/* <Icon icon={icon} iconSize={20} /> */}
                    {getIcon({type: getLayerTypeByGeometryType(props.geometry), iconSize: 16})}
                </div>
                <div>
                    <h6 className='text-overflow'>{props.name || props.id}</h6>
                    <p>{I18_PARAMS[props.type] || props.type} {props.source}</p>
                </div>
            </div>
            <div>
                <Button 
                    minimal='true' 
                    small='true'
                    title='删除' 
                    icon='remove'
                    onClick={() => { deleteSelected 
                        && deleteSelected({id: props.id, type: props.type}) }}
                    />
            </div>
        </div>
    )
}

function DatasetItem(props) {
    const {onChange} = props;
    return (
        <div className={classNames(styles.selectedItem, 'flex-vertical')}>
            <div>
                <div>
                    {getIcon({type: getLayerTypeByGeometryType(props.geotype), iconSize: 16})}
                </div>
                <div>
                    <h6>{props.name}</h6>
                    <p>{dayjs(props.updated_at).format('YYYY-MM-DD HH:mm')} {props.format}</p>
                </div>
            </div>
            <div>
                <Checkbox checked={props.checked} 
                    onChange={(e) => {
                        onChange && 
                        onChange({checked: e.target.checked,
                             id: props.id, 
                             geometry: props.geotype,
                             type: 'dataset'})
                    }} />
            </div>
        </div>
    )
}

function PublicMapItem(props) {
    const {onChange} = props;
    return (
        <div className={classNames(styles.selectedItem, 'flex-vertical', styles.publicItem)}>
            <div>
                <div>
                    <img src={`./images/logo/${props.thumbnail}`} />
                </div>
                <div>
                    <h6>{props.name}</h6>
                    <p>{props.type}</p>
                </div>
            </div>
            <div>
                <Checkbox checked={props.checked} 
                    onChange={(e) => {
                        onChange && 
                        onChange({
                             checked: e.target.checked,
                             id: props.id, 
                             name: props.name,
                             source: props.source,
                             geometry: 'raster',
                             type: 'public',
                             _source: props._source
                        })
                    }} />
            </div>
        </div>
    )
}


export default class AddSource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabId: 'dataset', // source, dataset, tileset
            tilesets: [],
            datasets: [],
            selected: [], // 已选择, {id, type(dataset|tileset), name, source}

            datasetPageCurrent: 1,
            datasetTotal: 0,
            datasetSearchKey: '',

            tilesetPageCurrent: 1,
            tilesetTotal: 0,
            tilesetSearchKey: ''

        }
    }

    deleteSelected = ({id, type}) => {
        const {selected} = this.state;
        this.setState({
            selected: selected.filter(s => s.id !== id && s.id !== type)
        })
    }

    addSelect = ({id, type, name, source, geometry, _source}) => {
        const {selected} = this.state;
        const {mode} = this.props;
        if(mode === 'multi' || mode === undefined) {
            if(!getObjectFromArray(selected, 'id', id)){
                selected.unshift({id, type, name, source, geometry, _source});
                this.setState({selected});
            }
        }
        if(mode === "single") {
            this.setState({selected: [{id, type, name, source, geometry, _source}]});
        }
    }

    // 选中
    handlerSelectChange = ({checked, id, type, name, source, geometry, _source}) => {
        if(checked) {
            this.addSelect({id, type, name, source, geometry, _source});
        } else {
            this.deleteSelected({id, type});
        }
    }

    isChecked = ({id, type}) => {
        const {selected} = this.state;
        return selected.filter(s => s.id === id && s.type === type).length === 1;
    }

    updatedDatasetList = () => {
        const { datasetSearchKey, datasetPageCurrent } = this.state;
        const params = {};
        if(datasetSearchKey) {
            params.keyword = datasetSearchKey;
        }
        params.start = (datasetPageCurrent - 1 )* PAGE_SIZE.dataset;
        params.rows = PAGE_SIZE.dataset;
        params.order = "updated_at desc";
        ajax_get({
            url:`datasets/`,
            data: params, 
        }).then((res) => {
            if(res && res.code === 200 && res.data) {
                this.setState({
                    datasets: (isEmptyObject(res.data.list) || !res.data.list) ? [] : res.data.list,
                    datasetTotal: res.data.total});
            } else {
                this.setState({datasets: [], datasetTotal: 0});
            }
        }); 
    }

    handlerChangePage = (page) =>{
        this.setState({tilesetPageCurrent: page});
        setTimeout(() => {
            this.updateTilesetList();
        }, 200);
    }

    updateTilesetList = () => {
        const { tilesetSearchKey, tilesetPageCurrent } = this.state;
        const params = {};
        if(tilesetSearchKey) {
            params.keyword = tilesetSearchKey;
        }
        params.start = (tilesetPageCurrent - 1 )* PAGE_SIZE.tileset;
        params.rows = PAGE_SIZE.tileset;
        params.order = "updated_at desc";
        ajax_get({
            url:`ts/`,
            data: params, 
        }).then((res) => {
            if(res && res.code === 200 && res.data) {
                this.setState({
                    tilesets: (isEmptyObject(res.data.list) || !res.data.list) ? [] : res.data.list, 
                    tilesetTotal: res.data.total});
            } else {
                this.setState({tilesets: [], tilesetTotal:0});
            }
        }); 
    }

    handlerChangeDatasetPage = (page) => {
        this.setState({pageCurrent: page});
        setTimeout(() => {
            this.updatedDatasetList();
        }, 200);
    }

    handleTabChange = (state) => {
        this.setState({selectedTabId:state});
    }

    componentWillMount() {
        this.updatedDatasetList();
        this.updateTilesetList();
    }

    render() {
        const {isOpen, handleOk, handleClose, layer, title, showMapSource, mode, showPublic } = this.props;
        if(!isOpen) return null;
        // mode 选择模式，支持单选和多选，单选为图层替换时使用，多选为批量导入图层时使用
        const {selectedTabId, 
                datasets, 
                datasetSearchKey, 
                datasetPageCurrent, 
                datasetTotal,

                tilesets,
                tilesetTotal,
                tilesetPageCurrent,
                tilesetSearchKey,

                selected
            } = this.state;

        const datasetPanel = (<div className={classNames(styles.unselectPanel, 'h100')}>
                <div>
                    <SearchInput value={datasetSearchKey} 
                        searchHandler = {this.updatedDatasetList}
                        onChange={(v) => {this.setState({datasetSearchKey: v})}} />
                </div>
                <div>
                <ScrollWrapper className={styles.scroll}>
                <div className={styles.scrollcontent}>
                    {showMapSource && <div>
                        <h5>当前地图已有数据集</h5>
                        <Divider className='mgb-1 mgt-1' />
                        <div>
                        <ul className={styles.dslist}>
                            {datasets.map((dataset, index) => {
                                return <li key={index}>
                                    <SourceCollapse title={dataset.name} type={dataset.type} />
                                </li>
                            })}
                        </ul>
                        </div>
                        <h5 className={'mgt-2'}>数据集列表</h5>
                        <Divider className='mgb-1 mgt-1' />
                    </div>}
                    <div>
                        <ul className={styles.dslist}>
                            {datasets.map((dataset, index) => {
                                return <li key={index}>
                                    <DatasetItem  
                                        onChange = {this.handlerSelectChange}
                                        checked={this.isChecked({id:dataset.id, type: 'dataset'})}
                                        {...dataset}
                                        />
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
                {datasets.length === 0 && <BlankCreate><p style={{fontSize: '14px'}}>未查询到数据集</p></BlankCreate>}
            </ScrollWrapper>
            </div>
            <div>
                <Pagination 
                    pageSize = {PAGE_SIZE.dataset}
                    current = {datasetPageCurrent}
                    onChange = {this.handlerChangeDatasetPage} 
                    total = {datasetTotal} />
            </div></div>);

        const tilesetPanel = (<div className={classNames(styles.unselectPanel, 'h100')}>
        <div>
            <SearchInput value={tilesetSearchKey} 
                searchHandler = {this.updateTilesetList}
                onChange={(v) => {this.setState({tilesetSearchKey: v})}} />
        </div>
        <div><ScrollWrapper className={styles.scroll}>
                <div className={styles.scrollcontent}>
                    <div>
                        <ul className={styles.list}>
                            {tilesets.map((tileset, index) => {
                                return <li key={tileset.id}>
                                    <SourceCollapse 
                                        id={tileset.id} 
                                        title={tileset.name} 
                                        checkedChange = {this.handlerSelectChange}
                                        isChecked = {this.isChecked}
                                        selected = {selected}
                                        mode = {mode}
                                         />
                                </li>
                            })}
                        </ul>
                        {tilesets.length === 0 && <BlankCreate><p style={{fontSize: '14px'}}>未查询到服务集</p></BlankCreate>}
                    </div>
                </div>
            </ScrollWrapper></div>
            <div>
                <Pagination 
                    pageSize = {PAGE_SIZE.tileset}
                    current = {tilesetPageCurrent}
                    onChange = {this.handlerChangePage} 
                    total = {tilesetTotal} />
            </div></div>);
        
        const publics = [];
        for(const key in PUBLIC_MAPS) {
            PUBLIC_MAPS[key].forEach((t) => {
                publics.push(t);
            });
        }

        const publicPanel = (
            <ScrollWrapper className={styles.scroll}>
                <div className={styles.scrollcontent}>
                    <div>
                        <ul className={styles.list}>
                            {publics.map((publicmap, index) => {
                                return <li key={index}>
                                    <PublicMapItem 
                                        onChange={this.handlerSelectChange}
                                        checked={this.isChecked({id:publicmap.id, type: 'public'})}
                                         {...publicmap} />
                                </li>
                            })}
                        </ul>
                        {publics.length === 0 && <BlankCreate><p style={{fontSize: '14px'}}>没有公共底图</p></BlankCreate>}
                    </div>
                </div>
            </ScrollWrapper>
            );
        
        const selection = <div className={classNames(mode === 'multi' && styles.selectionContainer, 'h100')}>
                <Tabs id="addSourceTabs" className={classNames(styles.tabs)}
                        vertical={true} large={true}
                        onChange={this.handleTabChange} selectedTabId={selectedTabId}>
                        <Tab id='dataset' title={<span><Icon icon="database" /> &nbsp;数据集 ({datasetTotal})</span>} 
                            panel={datasetPanel} />
                        <Tab id='tileset' title={<span><Icon icon="box" /> &nbsp;服务集 ({tilesetTotal})</span>} 
                            panel={tilesetPanel} />
                        <Tab id='public' title={<span><Icon icon="map" /> &nbsp;公共底图 ({publics.length})</span>} 
                        panel={publicPanel} />
                        <Tabs.Expander />
                </Tabs>
            </div>;

        const resultPane = mode === 'multi' && <div className={classNames(styles.selectedContainer, 'h100')}>
            <div>
                <h5>已选择数据源 {selected.length}</h5>
                <Button minimal={true} small={true} icon='trash' text='清空' 
                    disabled={selected.length === 0}
                    onClick={() => {this.setState({selected:[]})}}>
                </Button>
            </div>
            <Divider />
            <ScrollWrapper className={styles.selectedScroll}>
                <div className={styles.scrollcontent}>
                    <ul>
                        {selected.map((sl) => {
                            return <li key={sl.id}>
                                <SelectedItem 
                                    name={sl.name} 
                                    id={sl.id} 
                                    type={sl.type} 
                                    source={sl.source || ''}
                                    geometry = {sl.geotype || sl.geometry}
                                    deleteSelected = {this.deleteSelected}    
                                />
                            </li>
                        })}
                    </ul>
                    { selected.length === 0 && <BlankCreate><p style={{fontSize: '14px'}}>还未添加数据源，请从左侧选择</p></BlankCreate> }
                </div>
            </ScrollWrapper>
        </div>;
        const modalClassName = classNames(styles.main, 'disable-user-select',
            mode === 'multi' && styles.mainWider);
        const contentClassName = classNames(styles.content,mode === 'multi' 
            && styles.contentWider);
        return (
            <Modal icon='database' 
                title={title || '选择数据源'} 
                isOpen={isOpen} 
                handleClose={handleClose} 
                handleOk={() => { handleOk(selected) }} 
                okDisabled = {selected.length === 0}
                className={modalClassName}>
                <div className={contentClassName}>
                    {selection}
                    {resultPane}
                </div>
            </Modal>
        )
    }
}