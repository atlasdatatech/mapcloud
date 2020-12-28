import { Component } from 'react';
import classNames from 'classnames';
import styles from './IconSelect.less';
import { EditableText, ButtonGroup, Drawer, Button, Divider, Tab, Tabs, Tooltip,
    Callout, Card, Elevation, FormGroup, InputGroup, Tree, Icon, Intent,
    Classes, Position, Menu, MenuItem, Popover, Spinner } from "@blueprintjs/core";
import ScrollWrapper from '../../../components/ScrollWrapper';
import Modal from '../../../components/modals/BaseModal';
import ResizeImage from '../../../components/ResizeImage';
import IconUpload from './IconUpload';
import {ajax_get, ajax_post, getHost} from '../../../utils/ajax';
import {contain, isEmptyObject} from '../../../utils/util';
import Local from '../../../utils/local';
import {ToasterError} from '../../../components/Toaster';
import { FilterInput } from '../../../components/controls/Input';

export default class IconManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openUpload: false,
            icons: null,
            selected: null,
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
                this.setState({icons: null, selected:null, sprite: null, loaded: true});
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

    handleChange = (icon) => {
        const {onChange} = this.props;
        if(icon && onChange) {
            this.setState({selected: icon});
            onChange(icon);
        }
    }

    render() {
        
        const {loaded, selected, icons, filterKey, sprite} = this.state;
        const iconsArray = ((icons && Object.keys(icons).map(key => {
            return {id: key,...icons[key]}
        })) || []).filter(icon => icon.id.toLocaleLowerCase().indexOf(filterKey.toLocaleLowerCase()) >= 0);
        return (
            <div className={styles.main}>
                <div className={classNames(styles.filter, 'flex-vertical')}>
                    <div>
                        <FilterInput filterKey={filterKey} onChange={(e) => { this.setState({filterKey:e}) }} />
                    </div>
                    <div>{iconsArray.length} 个图标</div>
                </div>
                <div>
                    <ScrollWrapper className={classNames(styles.listScroll, 'fill-canvas')} 
                            options={{suppressScrollX: true}}>
                            <div className={styles.icons}>
                                <ul>
                                    {
                                        sprite && iconsArray.map((icon) => {
                                            return <li key={icon.id} 
                                                onClick={() => {this.handleChange(icon)}}
                                                className={classNames(selected && selected.id === icon.id && 'active')}>
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
                            </div>
                            {!loaded && <div className="mgt-3"><Spinner size={40} intent='primary' /></div>}
                    </ScrollWrapper>
                </div>
            </div>
        )
    }

}