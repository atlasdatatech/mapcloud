import { Component } from 'react';
import classNames from 'classnames';
import styles from './IconManage.less';
import { EditableText, ButtonGroup, Drawer, Button, Divider, Tab, Tabs, Tooltip,
    Callout, Card, Elevation, FormGroup, InputGroup, Tree, Icon, Intent,
    Classes, Position, Menu, MenuItem, Popover, Spinner } from "@blueprintjs/core";
import ScrollWrapper from '../../../components/ScrollWrapper';
import Modal from '../../../components/modals/BaseModal';
import ResizeImage from '../../../components/ResizeImage';
import IconUpload from './IconUpload';
import {ajax_get, ajax_post, getHost} from '../../../utils/ajax';
import {contain, isEmptyObject} from '../../../utils/util';
import {RGBAImage, getImageData} from '../../../utils/icon';
import Local from '../../../utils/local';
import {ToasterError} from '../../../components/Toaster';
import { FilterInput } from '../../../components/controls/Input';




export default class IconManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openUpload: false,
            icons: null,
            selected: [],
            loaded: false,
            sprite: null,
            filterKey: ''
        }
    }
    // 刷新列表
    updateList = () => {
        const {mapId, styleHelper} = this.props;
        const timescore = new Date().getTime();
        ajax_get({url:`maps/x/${mapId}/sprite.json?time=${timescore}`}).then((resJson) => {
            if(!resJson || isEmptyObject(resJson) || (resJson && resJson.code !== undefined && resJson.msg !== undefined)) {
                this.setState({icons: null, selected:[], sprite: null, loaded: true});
            } else {
                if(!isEmptyObject(resJson)) {
                    const url = getHost() + `maps/x/${mapId}/sprite.png?access_token=`
                    + Local.getAccessToken() +　'&time=' + timescore;
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = () => {
                        this.setState({
                            icons: resJson,
                            sprite: {
                                url: url,
                                width: img.width,
                                height: img.height,
                            },
                            loaded: true,
                        });
                        const imageData = getImageData(img);
                        const result = {};
                        for(const id in resJson) {
                            if(!isEmptyObject(resJson[id]) && resJson[id].width) {
                                const {width, height, x, y, pixelRatio, sdf} = resJson[id];
                                const data = new RGBAImage({width, height});
                                if(data.data) {
                                    RGBAImage.copy(imageData, data, {x, y}, {x:0, y:0}, {width, height});
                                    result[id] = {data, pixelRatio, sdf};
                                }
                            }
                        }
                        styleHelper.updateImages(result);
                    }
                    img.src = url;
                    styleHelper.updateSprite({mapId});
                }
            }
            
        });
    }

    componentDidMount() {
        this.updateList();
    }

    uploadedHandler = (e) => {
        this.updateList();
        this.setState({openUpload: false})
    }
    
    removeIcons = (ids, callback) => {
        if(!ids || ids.length === 0) return;
        const {mapId} = this.props;
        ajax_post({
            url:`maps/icons/${mapId}/delete/`,
            data: {
                names: ids,
                regenerate: true
            }
        }).then((res) => {
            if(res && res.code === 200) {
                callback && callback();
            } else {
                ToasterError({message:'删除图标错误:'+ res.msg});
            }
        });
    }

    removeSelected = () => {
        const {selected} = this.state;
        if(!selected || selected.length === 0) return;
        const ids = selected.map(s => s.id);
        this.removeIcons(ids, () => {
            this.updateList();
            this.setState({selected: []});
        })
    }

    clearAll = () => {
        const {icons} = this.state;
        this.removeIcons(Object.keys(icons), () => {
            this.updateList();
            // this.setState({selected: [], icons: null});
        });
    }

    toggleSelected = (icon) =>{
        const {selected} = this.state;
        if(this.isInSelected(icon.id)) {
            this.setState({selected: selected.filter(s => s.id !== icon.id)});
        } else {
            selected.push(icon);
            this.setState({selected});
        }
    }

    isInSelected = (id) => {
        const {selected} = this.state;
        return selected.filter(s => s.id === id).length > 0;
    }

    getIconElement = ({width, height, x, y}) => {
        const {sprite} = this.state;
        if(!sprite) return null;
        const style = {
            backgroundImage: `url("${sprite.url}")` ,
            backgroundSize: `${sprite.width}px ${sprite.height}px`,
            backgroundPosition: `${x}px ${y}px`,
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(1)`
        };
        
        return <div style={style}></div>
    }

    render() {
        const {openUpload, icons, sprite, filterKey, selected, loaded} = this.state;
        const { showIconManage, handleCloseIconManage, mapId } = this.props;
        const iconsArray = ((icons && Object.keys(icons).map(key => {
            return {id: key,...icons[key]}
        })) || []).filter(icon => icon.id.toLocaleLowerCase().indexOf(filterKey.toLocaleLowerCase()) >= 0);
        return (
            <Drawer title='图标管理' icon="media" isOpen={showIconManage} size='400px' onClose={handleCloseIconManage}>
                <div className={styles.main}>
                    <div>
                        图标主要用于点状元素的样式配置，支持SVG、PNG、JPEG格式图片，建议使用SVG格式
                    </div>
                    <div className={classNames(styles.filter, 'flex-vertical')}>
                        <div>
                            <FilterInput filterKey={filterKey} onChange={(e) => { this.setState({filterKey:e}) }} />
                        </div>
                        <div>{iconsArray.length} 个图标</div>
                    </div>
                    <ScrollWrapper className={classNames(styles.listScroll, 'fill-canvas')} 
                        options={{suppressScrollX: true}}>
                        <div className={styles.icons}>
                            <ul>
                                {
                                    sprite && iconsArray.map((icon) => {
                                        return <li key={icon.id} 
                                            onClick={() => {this.toggleSelected(icon)}}
                                            className={classNames(this.isInSelected(icon.id) && 'active')}>
                                            <Tooltip content={icon.id}>
                                                 <div style={{
                                                        backgroundImage: `url("${sprite.url}")` ,
                                                        backgroundSize: `${sprite.width}px ${sprite.height}px`,
                                                        backgroundPosition: `-${icon.x}px -${icon.y}px`,
                                                        width: `${icon.width}px`,
                                                        height: `${icon.height}px`,
                                                        transform: `scale(${icon.pixelRatio || 1})`
                                                    }}></div>
                                                 </Tooltip>
                                        </li>
                                    })
                                }
                            </ul>
                            {!loaded && <div className="mgt-3"><Spinner size={40} intent='primary' /></div>}
                        </div>
                    </ScrollWrapper>
                    <div className={styles.upload}>
                        <ButtonGroup fill='true'>
                        <Button intent='primary' text="上传图标" icon="upload" onClick={() => {this.setState({openUpload: true})}}>
                        </Button>
                        <Button icon="refresh" text="刷新" onClick={this.updateList} />
                        <Button text="删除" icon="cross" disabled={selected.length===0} onClick={this.removeSelected}></Button>
                        <Button text="清空" icon="trash" disabled={iconsArray.length === 0} onClick={this.clearAll}></Button>
                        </ButtonGroup>
                    </div>
                </div>
                {openUpload && <IconUpload 
                    mapId = {mapId}
                    isOpen={openUpload} 
                    cancelUpload = {() => { this.setState({openUpload: false}) }}
                    uploadedHandler={this.uploadedHandler} /> }
            </Drawer>
        )
    }
}