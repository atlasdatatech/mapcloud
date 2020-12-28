import { Component } from 'react';
import classNames from 'classnames';
import styles from './SourceCollapse.less';
import { Button, Card, Elevation, Checkbox, Spinner } from "@blueprintjs/core";
import {ExIcon} from '../../../../components/common';
import Collapse from '../../../../components/Collapse';
import {ajax_get} from '../../../../utils/ajax';
import {getLayerTypeByGeometryType} from '../../../../utils/map';
import {getIcon} from '../../../../utils/icon';

// 列表项
function Item(props) {
    const {id, source, name, iconStyle, isActive, geometry, checked, checkedChange} = props;
    if(!id) return null;
    return (
        <div className={classNames(styles.item, 'flex-vertical')}>
            <div className='flex-vertical'>
                <div>{getIcon({type: getLayerTypeByGeometryType(geometry), iconSize: 16})}</div>
                <div className="text-overflow">{id}</div>
            </div>
            <div>
                <Checkbox checked={checked} onChange={(e) => {
                    checkedChange && checkedChange({checked: e.target.checked, geometry, id, name:id, source, type: 'tileset'})
                }} />
            </div>
        </div>
    )
}

export default class SourceCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: [],
            loaded: false,
        }
    }

    onChange = (open) => {
        const {layers} = this.state;
        const {id} = this.props;
        if(open && layers.length === 0 && id) {
            ajax_get({
                url:`ts/x/${id}/`
            }).then((res) => {
                if(res && res.code && res.msg !== undefined) {
                    this.setState({loaded: true, layers: []});
                    return;
                }
                if(res) {
                    if(res.format === 'pbf' && res.tilestats) {
                        this.setState({loaded: true, layers: res.tilestats.layers.map((layer) => {
                            layer.id = layer.layer;
                            return layer;
                        })})
                    }
                    if(res.format === 'pbf' && !res.tilestats && res.vector_layers) {
                        this.setState({loaded: true, layers: res.vector_layers.map((layer) => {
                            layer.geometry = 'Point';
                            return layer;
                        })})
                    }
                    if(getLayerTypeByGeometryType(res.format) === 'raster') {
                        this.setState({loaded: true, layers: [
                            {id: res.id, geometry: "raster", name: res.name, type:'tileset'}
                        ]});
                    }
                } else {
                    this.setState({loaded: true})
                }
            });
        }
    }
    selectAll = (e) => {
        e.stopPropagation();
        const {layers} = this.state;
        const {checkedChange, id} = this.props;
        layers.forEach((layer) => {
            checkedChange({checked: true, id:layer.id, name: layer.id, type:'tileset', geometry: layer.geometry, source: id});
        })
    }

    render() {
        const {layers, loaded} = this.state;
        const {id, title, className, type, rightPane, checkedChange, isChecked, selected, mode } = this.props;
        // const selectedAll = 
        const selectAllBtn = mode !== 'single' && layers.length > 0 && layers.length !== selected.length && <Button text="全选" minimal='true' icon="small-tick" small='true' 
                    onClick={this.selectAll} />;
        return (
            <Collapse title={title} isOpen={false} icon={''} 
                rightPanel={selectAllBtn} 
                onChange={this.onChange}>
                {layers.length > 0 && 
                    <ul className={styles.list}>
                    {layers.map((layer, index) => {
                        return (
                            <li key={index}>
                                <Item 
                                    id={layer.id || layer.layer} 
                                    source={id} 
                                    geometry = {layer.geometry}
                                    checked={isChecked({id: layer.id, source: id, type:'tileset'})} 
                                    checkedChange={checkedChange} />
                            </li>
                        )
                    })
                    }
                </ul>
            }
            {
                !loaded && <div className="pd-1"><Spinner size={30} intent='success' /></div>
            }
            {
                loaded && layers.length === 0 && <div>此服务集下图层不可用</div>
            }
            </Collapse>
        )
    }
}