import { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import {ajax_get, ajax_post, getHost} from '../../../utils/ajax';
import LayerPane from '../components/LayerPane';
import BasemapPane from '../components/BasemapPane';
import SetBar from '../components/SetBar';
import SettingPane from '../components/SettingPane';
import IconManage from '../components/IconManage';
import InfoPane from '../../../components/map/Info';
import SharePane from '../../../components/modals/Share';
import MapTitle from '../components/MapTitle';
import { Divider } from "@blueprintjs/core";
import Search from '../../../components/Search';
import {Toolbar} from '../components/Toolbar';
import {ToasterSuccess, ToasterError, ToasterWarning} from '../../../components/Toaster';
import JsonEditor from '../../../components/JsonEditor';
import { guid, merge, isArray, contain } from '../../../utils/util';
import Resizable from 're-resizable';
import Style from '../../../utils/Style';
import { loadAtlas } from '../../../utils/load';
import { EditMap } from '../../../map/edit';
import Local from '../../../utils/local';
import { saveAs } from 'file-saver';
import {getMapViewLink} from '../../../utils/link';


const BLANK_LAYER = {
    id: `atlas-ex-${guid(true)}`,
    type: '',
    paint: {},
    layout: {},
    minzoom: undefined,
    maxzoom: undefined,
    metadata: {name:'未命名图层',group:''}
}

/**
 * @class MapEdit
 * @desc 地图编辑
 */
export default class MapEdit extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            // 是否加载完成
            loaded: false,

            // 样式ID
            styleId: props.match.params.id,

            // 样式 Helper
            styleHelper: new Style({
                syncEvent: (style) => { this.setState({style}) }
            }),

            // 样式 store
            style: null,

            // 显示图标管理
            showIconManage: false, 

            // 显示分享
            showShare: false, 

            /**
             * 当前焦点面板
             * layer 图层列表
             * basemap 底图设置
             * setting 配置
             * code 代码编辑面板
             */
            activePane: 'layer', 
            
            // 主配置面板初始宽度 css
            paneWidth: '320px',

            // 地图面板初始宽度 css
            mapPaneWidth: 'calc(100% - 60px - 320px)' ,
            
            // Style code 编辑器初始化高度
            styleEditorHeight: 300,

            // 当前图层 Id
            activeLayerId: null,

            // 当前选中
            selected: null,

            // 当前选中多个图层
            selecteds: [],

            info: null,

            mapInteracInfo: {},
        };

        

        // 主设置面板 Element
        this.paneRef = React.createRef();

        this.mapPane = React.createRef();
        // console.log(props.match.params.id);
    }

    /**
     * 设置当前图层
     * @param {String} layerId 图层ID
     */
    setActiveLayer = (layerId) => {
        const {styleHelper} = this.state;
        if(layerId && styleHelper.getLayer(layerId))  {
            this.setState({activeLayerId: layerId});
        }
    }

    addSelect = (layerId) => {
        const {selecteds} = this.state;
        if(contain(selecteds, layerId) < 0) {
            selecteds.push(layerId);
            this.setState({selecteds});
        }
    }

    clearSelecteds = () => {
        this.setState({selecteds: []});
    }

    toggleSelected = (layerId) => {
        const {selecteds} = this.state;
        if(contain(selecteds, layerId) >= 0) {
            this.deleteSelected(layerId);
        } else {
            this.addSelect(layerId);
        }
    }

    deleteSelected = (layerId) => {
        const {selecteds} = this.state;
        this.setState({
            selecteds: selecteds.filter(s => s !== layerId)
        });
    }

    /**
     * 设置选中
     */
    setSelected = (id, isMulti) => {
        this.setState({selected: id});
    }

    // 获取当前图层
    getActiveLayer = () => {
        const {styleHelper, selected} = this.state;
        return styleHelper.getLayer(selected);
    }

    setGlobalState = (type, val) => {
        this.setState({[type]: val});
    }

    initMap =() => {
        if(!this.mapPane.current || !window.atlas) return;
        const {styleHelper} = this.state;
        this.map = EditMap({
            container: this.mapPane.current,
            style: styleHelper.getStyleByMap()
        });
        if(!this.map) return;
        window.map = this.map;
        window.styleHelper = styleHelper;
        styleHelper.setMap(this.map);
        

        map.addControl(new atlas.NavigationControl(),"top-right");
        map.addControl(new atlas.FullscreenControl(),"top-right");

        map.on('load', () => {
            if(!this.measure) {
                this.measure = new atlas.MeasureTool(map, {
                    cursor: 'url(./images/ruler.cur), auto'
                });
                styleHelper.measureTool = this.measure;
            }
            styleHelper.initInspect();
            map.on('mousemove', (e) => {
                if(!e) return;
                const {mapInteracInfo} = this.state;
                mapInteracInfo.mouseLatLng =  e.lngLat.toArray();
                mapInteracInfo.mouseClientPosition = e.point;
                this.setState({mapInteracInfo});
            });
    
            map.on('moveend', (e) => {
                const {mapInteracInfo} = this.state;
                mapInteracInfo.zoom = map.getZoom();
                mapInteracInfo.center = map.getCenter().toArray();
                mapInteracInfo.bound = map.getBounds().toArray();
                this.setState({mapInteracInfo});
            });
        })
        
    }

    mapHandle = ({type, handle}) => {
        const map = this.map;
        const measure = this.measure;
        const {styleHelper} = this.state;
        if(map && measure) {
            if(type === 'measure') {
                switch(handle) {
                    case 'distance':
                        measure.activate('distance');
                        break;
                    case 'area':
                        measure.activate('area');
                        break;
                    case 'clear':
                        measure.clear();
                        break;
                }
            }
            if(type === 'thumbnail') {
                map.getScreenshot({saveAsFile: true});
            }
        }
    }


    componentDidMount() {
        const height = this.paneRef.current.clientHeight;
        this.setState({styleEditorHeight: height - 50});
        window.addEventListener('resize', this._onWindowResize);
        const id = this.props.match.params.id;
        const type = this.props.location.query.type;
        // 加载样式
        ajax_get({url:`maps/x/${id}/`}).then((data) => {
            const {styleHelper} = this.state;
            styleHelper.setStyle(data, {type});
            loadAtlas(this.initMap);
        });

        ajax_get({url: `maps/info/${id}/`}).then((res) => {
            if(res && res.code === 200 && res.data) {
                this.setState({info: res.data});
            }
        });
    }

    updateInfo =({name}) => {
        const {info} = this.state;
        info.name = name;
        this.setState({info});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onWindowResize);
        if(this.measure) {
            this.measure.deactivate();
        }
        if(this.map) {
            this.map.remove();
        }
    }

    _onWindowResize = () => {
        const height = this.paneRef.current.clientHeight;
        this.setState({styleEditorHeight: height - 50});
    }

    codeOnChange = (style) => {
        const {styleHelper} = this.state;
        var isValid = styleHelper.validateStyleBySpec(style);
        if(isValid) {
            styleHelper.setStyle(style);
        } else {
            ToasterWarning({message:'样式校验失败'});
        }

    }

    saveMap =() => {
        const id = this.props.match.params.id;
        const {styleHelper} = this.state;
        styleHelper.updateMapState();
        const map = styleHelper.map;
        const style = styleHelper.getStyleByMap();
        const flag = styleHelper.validateStyleBySpec(style);
        if(!flag) {
            ToasterWarning({message: '地图样式校验失败，请检查样式配置'});
            return;
        }
        ajax_post({
            url: `maps/update/${id}/`,
            data: style
        }).then((res) => {
            if(res && res.code === 200)  {
                if(map) {
                    map.getThumbnail({width: 240, height: 100, quality: 1}).then((thumbnail) => {
                        const _info = merge({}, this.state.info);
                        _info.thumbnail = styleHelper.getLayers().length !== 0 ? thumbnail : 'none';
                        ajax_post({
                            url:`maps/info/${id}/`,
                            data: _info
                        }).then((res) => {
                            if(res && res.code === 200) {
                                ToasterSuccess({message: '地图保存成功'});
                            } else {
                                ToasterError({message: '地图保存失败: ' + res.msg});
                            }
                        });
                    });
                } else {
                    ToasterSuccess({message: '地图保存成功'});
                }
            } else {
                ToasterError({message: '地图保存失败: ' + res.msg});
            }
        });
    }

    exportStyle = () => {
        const mapId = this.props.match.params.id;
        saveAs(`${getHost()}maps/download/${mapId}/?access_token=${Local.getAccessToken()}`);
    }
    
    render() {
        const {showIconManage, activeLayerId, activePane, showShare, 
                loaded, style, mapInteracInfo,
                paneWidth, mapPaneWidth, styleEditorHeight, 
                styleHelper, selected, selecteds,  info } = this.state;
        const name = (info && info.name) || '';
        const activeLayer = this.getActiveLayer();
        const mapId = this.props.match.params.id;
        const viewLink = getMapViewLink(mapId);
        return (
            <div className={classNames(styles.container, 'at-map-editor h100 clearfix  fill-canvas')}>
                <div>
                <div className={classNames(styles.setBar, 'at-me-setbar h100')}>
                    <SetBar 
                        setGlobalState={this.setGlobalState} 
                        activePane={activePane}
                        saveMap= {this.saveMap}
                        viewLink = {viewLink}
                        exportStyle = {this.exportStyle}
                         />
                </div>
                <Resizable ref={c => { this.resizable = c; }} 
                    onResize={(e, direction, ref, d) => {
                        const width = ref.style.width;
                        this.setState({
                          paneWidth: width,
                          mapPaneWidth: `calc(100% - 60px - ${width})`
                        });
                        if(this.codeEditor) {
                            this.codeEditor.setSize(width);
                        }
                    }} 
                    minWidth = {320}
                    maxWidth = {700}
                    minHeight = {'100%'}
                    size={{ width: this.state.paneWidth, height:'100%'}}>
                <div className={classNames(styles.pane, 'at-me-pane h100')} style={{width:paneWidth}} ref={this.paneRef}>
                    <div className={classNames(styles.sider, 'h100')}>
                        <MapTitle name={name} onChange={(e) => { this.updateInfo({name: e}) }} />
                        <Divider />
                        {activePane === 'layer' && <LayerPane 
                            style = { style }
                            mapId = {mapId}
                            setSelected = {this.setSelected}
                            selected = {selected}
                            selecteds = {selecteds}
                            styleHelper = { styleHelper }
                            activeLayer = { activeLayer } 
                            setActiveLayer = {this.setActiveLayer}
                            addSelect = {this.addSelect}
                            deleteSelected = {this.deleteSelected}
                            clearSelecteds = {this.clearSelecteds}
                            toggleSelected = {this.toggleSelected}
                        /> }
                        {activePane === 'basemap' && <BasemapPane style={style} styleHelper={styleHelper} /> }
                        {activePane === 'setting' && <SettingPane style={style} styleHelper={styleHelper} /> }
                        {style && activePane === 'code' && 
                            <JsonEditor jsonObject={style} 
                                height={styleEditorHeight} 
                                width={paneWidth}
                                saveHandle = {this.codeOnChange}
                                resize = {true}
                            /> }
                    </div>
                </div>
                </Resizable>
                <div ref={this.mapPane} className={classNames(styles.main, 'at-me-main h100')} style={{width: mapPaneWidth}}>
                </div>
                {
                    showIconManage && <IconManage 
                        showIconManage={showIconManage}
                        mapId={mapId}
                        styleHelper= {styleHelper}
                        handleCloseIconManage = {() => {this.setState({showIconManage: false})}}
                        />
                }
                <div className={styles.search}>
                    {/* <Search /> */}
                </div>
                <div className={styles.toolbar}>
                    <Toolbar onChange={this.mapHandle} />
                </div>
                {showShare && <SharePane isOpen={showShare} url={getMapViewLink(mapId)} title='地图分享'
                    handleClose={() => { this.setState({showShare: false}) }}>
                    <h3 className='pt-2 text-center text-overflow'>{name}</h3>  
                    <p className='pt-1'>您可将此地图分享给好友，手机扫描二维码或复制URL地址，访问并浏览地图</p>
                </SharePane>}
                </div>
                <div className={styles.infos}>
                    <InfoPane info={mapInteracInfo} />
                </div>
                
            </div>
        )
    }
}