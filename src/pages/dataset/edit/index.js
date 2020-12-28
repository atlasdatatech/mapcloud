import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import router from 'umi/router';
import BlankCreate from '../../../components/BlankCreate';
import ScrollWrapper from '../../../components/ScrollWrapper';
import JsonEditor from '../../../components/JsonEditor';
import {ExEditableText, ExIcon} from '../../../components/common';
import UploadModal from '../../../components/modals/UploadModal';
import { EditableText, ButtonGroup, Button, Divider, Tab, Tabs, 
        Callout, Card, Elevation, FormGroup, InputGroup } from "@blueprintjs/core";
import DrawTool from '@mapbox/mapbox-gl-draw';
import { loadAtlas } from '../../../utils/load';
import {MAP_CENTER, MAP_ZOOM, MAP_STYLE} from '../../../const/core';
import { FeatureCollection, Feature } from '../../../utils/geojson';
import FeatureEditPane from '../components/FeatureEdit';
import ToolPane from '../components/Tool';
import InfoPane from '../components/Info';



const testData = {
    type: 'Point',
    geometry: {
        type: 'Point',
        coordinate: [12,12]
    },
    properties: {
        // f1: 123,
        // f2: 14,
        // f3: 14,
        // f4: 14,
        // f5: 14,
        // f6: 14,
        // f7: 14,
        // f8: 14,
        // f9: 14,
        // f10: 14,
    }
};

export default class DatasetEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 当前Geojson
            geojson: new FeatureCollection(),
            // 当前选中元素
            featureId: null,
            // 地图交互信息
            mapInteracInfo: {},
            // 显示上传窗口
            showUpload: false,
        }
        this.mapRef = React.createRef();
    }

    componentDidMount() {
        loadAtlas(() => {
            this.initMap();
        });
    }

    componentWillUnmount() {
        if(this.map) {
            map.remove();
        }
        this.map = null;
    }

    initMap = () => {
        const map = this.map = new atlas.Map({
            container: this.mapRef.current,
            center: MAP_CENTER,
            zoom: MAP_ZOOM,
            style: MAP_STYLE
        });

        window.map = map;

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
            this.setState({mapInteracInfo});
        });
    }

    goBack = () => {
        router.goBack();
    }

    getFeature = () => {
        const {featureId, geojson} = this.state;
        return geojson.getFeature(featureId);
    }


    render() {
        const {geojson, mapInteracInfo} = this.state;
        const feature = geojson.getFeature();
        const map = this.map;

        return (
            <div className={classNames(styles.main, 'h100')}>
                <div className={classNames(styles.pane, 'at-me-pane')}>
                    {/* 返回、标题编辑 */}
                    <div className={classNames(styles.paneHead, 'clearfix mgb-1')}>
                        <div className='flex-vertical'>
                            <Button minimal={true} onClick={this.goBack}>
                                <ExIcon icon="&#xe62b;" />
                            </Button>
                        </div>
                        <div className='flex-vertical'>
                            <ExEditableText text={'数据集标题'} onChange={(e) => {}} showButton={true} />
                        </div>
                    </div>
                    <div className={classNames(styles.btns, 'mgb-1')}>
                        <ButtonGroup>
                            <Button><i className="iconfont">&#xe62b;</i> 保存</Button>
                            <Button><i className="iconfont">&#xe62b;</i> 导出</Button>
                            <Button><i className="iconfont">&#xe62b;</i> 导入</Button>
                            {/* <Button><i className="iconfont">&#xe62b;</i> 点</Button>
                            <Button><i className="iconfont">&#xe62b;</i> 线</Button>
                            <Button><i className="iconfont">&#xe62b;</i> 面</Button> */}
                        </ButtonGroup>
                    </div>
                    <Divider className='mg0' />
                    <FeatureEditPane feature={feature} />
                </div>
                <div className={classNames(styles.map, 'at-map-editor fill-canvas')} ref={this.mapRef}></div>
                <div className={classNames(styles.tools)}>
                    <ToolPane feature={feature} geojson={geojson} map={map} />
                </div>
                <div className={classNames(styles.search)}></div>
                <div className={classNames(styles.infos)}>
                            <InfoPane info={mapInteracInfo} />
                </div>
                <UploadModal isOpen={this.state.showUpload} title='上传GeoJSON数据'>

                </UploadModal>
            </div>
        )
    }
}