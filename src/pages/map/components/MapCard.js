import { Component } from 'react';
import classNames from 'classnames';
import styles from './MapCard.less';
import { ButtonGroup, Button, Popover, Position, Divider, Icon,
    Card, Elevation, Callout, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import dayjs from 'dayjs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Toaster from '../../../components/Toaster';
import Local from '../../../utils/local';
import config from '../../../config';
import { getMapStyleLink, getMapViewLink } from '../../../utils/link';


export default class MapCard extends Component {
    constructor(props) {
        super(props);
    }

    copied = () => {
        Toaster.show({message: '已复制到剪切版', intent:'success', icon:'tick-circle'});
    }

    render() {
        const {map, operateHandler, isPublic} = this.props;
        if(!map) return null;
        const mapLink = getMapStyleLink(map.id);
        const viewLink = getMapViewLink(map.id);        
        
        const menusPane = !isPublic && (
            <Menu>
                <MenuItem icon="edit" text="编辑" onClick={() => { operateHandler({type:'edit', map}) }}>
                </MenuItem>
                <MenuItem icon="duplicate" text="复制" onClick={() => { operateHandler({type:'clone', map}) }}>
                </MenuItem>
                <MenuItem icon="trash" text="删除" onClick={() => { operateHandler({type:'delete', map}) }}>
                </MenuItem>
                <MenuDivider />
                <MenuItem icon="trash" text="替换" onClick={() => { operateHandler({type:'replace', map}) }}>
                </MenuItem>
                <MenuItem icon="download" text="下载" onClick={() => { operateHandler({type:'download', map}) }}>
                </MenuItem>
            </Menu>
        );

        const moreOperate = !isPublic && <Popover content={menusPane} position={Position.BOTTOM_LEFT}>
                <Button minimal={true} icon="more" title="更多操作"></Button>
            </Popover>;
        const isEmptyThumbnail = !map.thumbnail || map.thumbnail === 'none';
        const thumbnail = <img src={isEmptyThumbnail ? './images/thumbnail.svg' : map.thumbnail} className={classNames(isEmptyThumbnail && styles.emptyImage)} />
        return (
            <Card interactive={true} elevation={Elevation.ONE}>
                <div className={classNames('at-card-content', styles.item)}>
                    <div className='at-bg-light' onClick={() => { !isPublic && operateHandler({type:'edit', map}) } } title={!isPublic ? "点击编辑":"点击查看"}>
                        {isPublic && <a href={viewLink} target='_blank'>{thumbnail}</a> }
                        {!isPublic && thumbnail }
                    </div>
                    <h5 className="text-overflow">{map.name || map.id}</h5>
                    {/* <p><i className="iconfont">&#xe62b;</i> {map.tag}</p> */}
                    {
                        !isPublic && <div className={classNames(styles.time, "flex-vertical")}>
                        <div><Icon icon="time" className="at-light-color" /></div>
                        <div className="text-overflow">{dayjs(map.updated_at).format('YYYY-MM-DD HH:MM')}</div>
                        </div>
                    }
                    <div className={classNames(styles.operators, "flex-vertical")}>
                        <div className="flex-vertical">
                            {!isPublic && <Button minimal={true} 
                                title={map.public ? '设置为私有地图' : '设置为公开地图'}
                                icon={map.public ? 'unlock' : 'lock'} 
                                onClick={() => { operateHandler({type: map.public ?'private' : 'public', map: map}) }}></Button>}
                        </div>
                        <div className="flex-vertical">
                            <div>
                                <ButtonGroup minimal={true}>
                {!isPublic && <Button className={styles.link} title="浏览" onClick={() => { operateHandler({type:'view', map: map}) }}><a href={viewLink} target="_blank"><Icon icon="eye-open" /></a></Button> }
                                    <Button icon="share" title="分享" onClick={() => { operateHandler({type:'share', map: map}) }}></Button>
                                    <CopyToClipboard text={mapLink} onCopy={this.copied}>
                                        <Button icon="link" title="复制地图样式地址"></Button>
                                    </CopyToClipboard>
                                    {isPublic &&<Button icon="download" title="下载地图样式" onClick={() => { operateHandler({type:'download', map: map}) }}></Button>}
                                </ButtonGroup>
                            </div>
                            <div>
                                {moreOperate}
                            </div>
                        </div>
                    </div>
                </div>
                
            </Card>
        )
    }
}