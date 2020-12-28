import {Component} from 'react';
import classNames from 'classnames';
import styles from './LayerTree.less';
import { Button, Divider, Tree, Icon, Hotkey, Hotkeys, HotkeysTarget,  
    Position, Menu, MenuItem, Popover } from "@blueprintjs/core";
import LayerLabel from './LayerLabel';
import { DropTarget } from 'react-dnd';
import {addClass, removeClass, removeTreeHoverClass} from '../../../../utils/dom';
import {getIcon} from '../../../../utils/icon';
import {I18_PARAMS} from '../../../../const/i18';
import { getObjectFromArray, moveInArray, isEmptyObject, contain, sort, removeObjectFromArray, isString } from '../../../../utils/util';

function pointInRect(point, rect) {
    if(!point || !rect) return false;
    const {x, y} = point;
    const {minx, maxx, miny, maxy} = rect;
    return x > minx && x < maxx && y > miny && y < maxy;
}

function clearHoverClass(ele) {
    removeClass(ele, 'before');
    removeClass(ele, 'after');
    removeClass(ele, 'inner');
}

let dropTarget = null;

function traversNodes(tree, nodes, sourceOffset, sourceId, sourceType) {
    if(!nodes) return;
    nodes.forEach((node, index) => {
        if(sourceId === node.id) return;
        let position = null;
        let preEle = null;
        let targetId = node.id;
        const type = node.nodeData.type;
        if(!type) return;
        if(type === 'layer') {
            const isInGroup = !!node.nodeData.group;
            if(sourceType === 'group' && isInGroup) return;
            const nodeEle = tree.getNodeContentElement(node.id);
            const ele =nodeEle && nodeEle.parentNode;
            if(!ele) return;
            clearHoverClass(ele);
            const {x, y, width, height} = ele.getBoundingClientRect(); // {x, y, width, height}
            const splitY = Math.round(y + (height / 3));
            const up = {minx: x, maxx: x + width, maxy: splitY, miny: y };
            const down = {minx: x, maxx: x + width, maxy: y + height, miny: splitY + 2 };
            if(pointInRect(sourceOffset, up)) {
                position = 'after';
                addClass(ele, "after");
            }
            if(pointInRect(sourceOffset, down)) {
                position = 'before';
                addClass(ele, "before");
            }
            if(position) {
                dropTarget = {
                    sourceId,
                    targetId,
                    element: ele,
                    position,
                }
                return;
            }
        } else if(type === 'group' && node.childNodes){
            let pos = null;
            const ele = tree.getNodeContentElement(node.id);
            if(index > 0 && nodes[index - 1]) {
                preEle = tree.getNodeContentElement(nodes[index - 1].id);
            }
            clearHoverClass(ele);
            if(preEle) {
                // clearHoverClass(preEle);
            }
            let isPre = false;
            const {x, y, width, height} = ele.getBoundingClientRect(); // {x, y, width, height}
            const up = {minx: x, maxx: x + width, maxy: Math.round(y + (height / 4)), miny: y }; // 前位置
            const middle = {minx: x, maxx: x + width, maxy: Math.round(y + (height * 2 / 4)), miny: Math.round(y + (height / 4)) }; // 前位置
            const down = {minx: x, maxx: x + width, maxy: y + height, miny: Math.round(y + (height * 2 / 4)) }; // 后位置
            
            if(pointInRect(sourceOffset, up)) {
                pos = "after";
                addClass(ele, "after");
                // if(preEle) {
                //     addClass(preEle, "after");    
                //     targetId = nodes[index - 1].id;
                //     isPre = true;
                // } 
            }
            if(sourceType === 'layer' && pointInRect(sourceOffset, middle)) {
                addClass(ele, "inner");
                pos = "inner";
            }
            if(pointInRect(sourceOffset, down)) {
                addClass(ele, "before");
                pos = "before";
            }
            if(pos) {
                dropTarget = {
                    sourceId,
                    targetId,
                    element: isPre ? preEle : ele,
                    position: pos,
                }
                return;
            } else {
                traversNodes(tree, node.childNodes, sourceOffset, sourceId, sourceType);
            }
        }
    });
}

function activateDropTargetNode({tree, layers, sourceOffset, sourceId, type}) {
    if(!tree || !tree.getNodeContentElement || !layers || !layers.length || !sourceOffset || !sourceId) return null;
    const treeList = tree.props.contents;
    traversNodes(tree, treeList, sourceOffset, sourceId, type);
}


const types = {
    // canDrop(props, monitor) {
    //     return true;
    // },
    hover(props, monitor, component) {
        const layers = component.props.layers;
        const tree = component.props.tree;
        const item = monitor.getItem();
        activateDropTargetNode({
            tree, 
            layers, 
            sourceOffset: monitor.getClientOffset(), 
            sourceId: item.id,
            type: item.type
        });
    },
    drop(props, monitor, component) {
        const item = monitor.getItem();
        const {styleHelper, selected} = props;
        if(dropTarget && dropTarget.element) {
            if(styleHelper) styleHelper.move(dropTarget);
        }
        removeTreeHoverClass(styles.tree);
        dropTarget = null;
    }
};

function collect(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType()
    };
  }

function LayerOperates(props) {
    const {renameLayer, copyLayer, deleteLayer,  layer, openLayerSetting, styleHelper} = props;
    if(!layer || !layer.id) return null;
    const group = layer.metadata && layer.metadata.group;
    return (
        <Menu>
            {/* <MenuItem onClick={() => { renameLayer(true) }} icon="wrench" text='重命名' /> */}
            <MenuItem onClick={() => { styleHelper.setCenterByLayer(layer.id) }} icon="map-marker" text='定位' />
            <MenuItem icon="settings" onClick={() => { props.openLayerSetting(layer.id) }} text='设置' />
            <MenuItem onClick={() => {copyLayer(layer.id)}} icon="duplicate" text='复制' />
            <MenuItem onClick={() => {deleteLayer(layer.id)}} icon="trash" text='删除' />
            {/* group */}
            {
                group && <MenuItem onClick={() => {styleHelper.updateLayerMetadata(layer.id, {group: null})}} icon="ungroup-objects" text='移出组' /> 
            }
            
            <MenuItem onClick={() => {styleHelper.moveToTop(layer.id)}} text='置顶' icon="alignment-top" /> 
            <MenuItem onClick={() => {styleHelper.moveToBottom(layer.id)}} text='置底' icon="alignment-bottom" /> 
        </Menu>
    );
}

function GroupOperates(props) {
    const {copyGroup, styleHelper, groupId} = props;
    return (
        <Menu>
            <MenuItem onClick={() => {styleHelper.removeGroup(groupId)}} icon="ungroup-objects" text='解散' />
            <MenuItem onClick={() => {styleHelper.removeGroup(groupId, true)}} icon="trash" text='删除' />
        </Menu>
    );
}

// @HotkeysTarget
class LayerTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditLayerTitle: false,
            selected: [],
            selectType: null ,// shift, ctrl, null
        };
        this.treeWrapperRef = React.createRef();
    }

    // renderHotkeys = () => {
    //     return <Hotkeys>
    //         <Hotkey
    //             global={true}
    //             combo="shift"
    //             // label="Be awesome all the time"
    //             onKeyUp = {() => {
    //                 this.setState({selectType: null})
    //             }}
    //             onKeyDown={() => {
    //                 this.setState({selectType: 'shift'})
    //             }}
    //         />
    //         <Hotkey
    //             group="Fancy shortcuts"
    //             combo="ctrl"
    //             onKeyUp = {() => {
    //                 this.setState({selectType: null})
    //             }}
    //             // label="Be fancy only when focused"
    //             onKeyDown={() => {
    //                 this.setState({selectType: 'ctrl'})
    //             }}
    //         />
    //     </Hotkeys>;
    // }


    _getTreeNodes = () => {
        const { activeLayer, style, styleHelper, 
                layers, deleteLayer, copyLayer, 
                openActiveLayerSetting } = this.props;
        if(!layers || !layers.length) return [];
        const {isEditLayerTitle} = this.state;
        const activeLayerId = activeLayer && activeLayer.id;

        return layers.map((layer, index) => {
            const ref = React.createRef();
            const content = <LayerOperates 
                layer={layer} 
                copyLayer={copyLayer}
                deleteLayer={deleteLayer}
                openLayerSetting = {openActiveLayerSetting}
                styleHelper = {styleHelper}
                 />
            const isHidden = layer.layout.visibility === 'none';
            const name = (layer.metadata && layer.metadata.name) || layer.id;
            const isActiveLayer = layer.id === activeLayerId;
            return {
                id: layer.id,
                // isExpanded: true,
                isSelected: layer.id === activeLayerId,
                icon : <Button small={true}
                    className={styles.visibleBtn}
                    minimal={true}
                    icon = {<Icon icon={!isHidden ? 'eye-open' : 'eye-off'} 
                    color={isActiveLayer ? '#eee' : !isHidden ? '#5c7080' : '#aaa'
                    } />} 
                    onClick={(e) => {
                        styleHelper.toggleLayerVisibility(layer.id)
                    }} />,
                label: <LayerLabel
                    layer={layer} 
                    ref = {ref}
                    onChange = {(e) => {
                        styleHelper.updateLayer({id: layer.id, name: e}, 'metadata');
                    }}
                    isActive={layer.id === activeLayerId && isEditLayerTitle}
                    styleHelper = {styleHelper}
                    />,
                secondaryLabel: (<Popover content={content} position={Position.RIGHT_TOP}>
                    <Button small={true} minimal={true} title="图层操作" icon="more"></Button>
                </Popover>),
            }
        });
    }

    getLayerNode = (layer) => {
        const { activeLayer, style, styleHelper, 
            layers, deleteLayer, copyLayer, selected,
            selecteds,
            openActiveLayerSetting } = this.props;
        if(!layer) return null;
        const {isEditLayerTitle} = this.state;
        const activeLayerId = activeLayer && activeLayer.id;

        const ref = React.createRef();
        const content = <LayerOperates 
            layer={layer} 
            copyLayer={copyLayer}
            deleteLayer={deleteLayer}
            openLayerSetting = {openActiveLayerSetting}
            styleHelper = {styleHelper}
             />
        const isHidden = layer.layout.visibility === 'none';
        const name = (layer.metadata && layer.metadata.name !== undefined) ? (layer.metadata.name || '') : layer.id;
        const isActiveLayer = layer.id === selected;
        const iconSize = layer.type === 'circle' ? 18 : 12;
        const isSelected = layer.id === selected;
        return {
            id: layer.id,
            nodeData: {
                type: 'layer',
            },
            // isExpanded: true,
            isSelected,
            icon : <Button small={true}
                className={styles.visibleBtn}
                minimal={true}
                icon = {<Icon icon={!isHidden ? 'eye-open' : 'eye-off'} 
                color={isSelected ? '#eee' : !isHidden ? '#5c7080' : '#aaa'
                } />} 
                onClick={(e) => {
                    e.stopPropagation();
                    styleHelper.toggleLayerVisibility(layer.id)
                }} />,
            label: <LayerLabel
                name = {name}
                ref = {ref}
                onChange = {(e) => {
                    styleHelper.updateLayer({id: layer.id, name: e}, 'metadata');
                }}
                icon = {getIcon({
                    type: layer.type, 
                    iconSize, 
                    color: styleHelper.getLayerColor(layer.id),
                    title: `${I18_PARAMS[layer.type]} - ${name}`
                })}
                treeClassName = {styles.tree}
                isActive={isSelected && isEditLayerTitle}
                id = {layer.id}
                type = "layer"
                styleHelper = {styleHelper}
                />,
            secondaryLabel: (<Popover content={content} position={Position.RIGHT_TOP}>
                <Button small={true} minimal={true} title="图层操作" icon="more"></Button>
            </Popover>),
        }
    }

    getGroupNode = ({id, name, visibility, isExpanded, layers}) => {
        const { styleHelper, selected, selecteds } = this.props;
        const isHidden = visibility === 'none'; // 是否隐藏
        const isSelected = id === selected; // 选中状态
        const content = <GroupOperates groupId={id} {...this.props} />
        const ref = React.createRef();
        return {
            id,
            isSelected,
            nodeData: {
                type: 'group',
            },
            childNodes: [],
            icon : <Button small={true}
                className={styles.visibleBtn}
                minimal={true}
                icon = {<Icon icon={!isHidden ? 'eye-open' : 'eye-off'} 
                color={isSelected ? '#eee' : !isHidden ? '#5c7080' : '#aaa'
                } />} 
                onClick={(e) => {
                    styleHelper.toggleGroupVisibility(id)
                }} 
            />,
            label: <LayerLabel
                name = {name}
                ref = {ref}
                onChange = {(e) => {
                    styleHelper.updateGroup(id, {name: e})
                }}
                id = {id}
                type = "group"
                treeClassName = {styles.tree}
                icon = {<Icon icon={!isExpanded ? 'folder-close' : 'folder-open'} />}
                styleHelper = {styleHelper}
            />,
            hasCaret: layers.length > 0,
            isExpanded: !!isExpanded,
            secondaryLabel: (<Popover content={content} position={Position.RIGHT_TOP}>
                <Button small={true} minimal={true} icon="more"></Button>
            </Popover>),
            
        }
    }

    _getGroupNode = (id) => {
        const { styleHelper } = this.props;
        const _group = styleHelper.getLayer(id);
        if(_group) {
            const layers = styleHelper.getGroupLayers(id);
            const {name, visibility, isExpanded} = _group.metadata;
            return this.getGroupNode({id, name, visibility, isExpanded, layers});
        }
        return null;
    }

    getTreeNodes = () => {
        const { layers } = this.props;
        if(!layers || !layers.length) return [];
        const treeList = [];
        layers.forEach((ly) => {
            const isGroup = ly.metadata && ly.metadata.isGroup;
            if(isGroup) {
                const groupNode = getObjectFromArray(treeList, 'id', ly.id);
                if(!groupNode) {
                    const node = this._getGroupNode(ly.id);
                    if(node) {
                        treeList.push(node);
                    }
                }
            } else {
                const groupId = ly.metadata && ly.metadata.group;
                const layerNode = this.getLayerNode(ly);
                if(groupId) {
                    layerNode.nodeData.group = groupId;
                    const groupNode = getObjectFromArray(treeList, 'id', groupId);
                    if(groupNode) {
                        groupNode.childNodes.push(layerNode); 
                    } else {
                        const node = this._getGroupNode(groupId);
                        if(node) {
                            node.childNodes.push(layerNode); 
                            treeList.push(node);
                        }
                    }
                } else {
                    treeList.push(layerNode);
                }
            }
        });

        treeList.forEach(tr => {
            if(tr.childNodes) {
                tr.childNodes.reverse();
            }
        });

        return treeList.reverse();
    }

    isLabelTitle = (target) => {
        let count = 5;
        function getLabelNode(ele) {
            if(!ele) return false;
            count--;
            const className = ele.parentNode && ele.parentNode.className;
            if(className && isString(className) && className.indexOf("layerTitle") > 0) {
                return true;
            } else {
                if(count < 0) return false;
                return getLabelNode(ele.parentNode);
            }
        }
        return getLabelNode(target);
    }

    // 单击节点
    treeNodeClick = (node, index, e) => {
        e.stopPropagation();
        e.preventDefault();
        const { selectType } = this.state;
        const isLabelTitle = this.isLabelTitle(e.target);
        if(isLabelTitle) {
            // const {selectType} = this.state;
            const {setSelected, selected} = this.props;
            // if(selectType === 'ctrl') {
            //     toggleSelected(node.id);
            // }
            // if(selectType === 'shift') {

            // }
            // if(!selectType) {
            // }
            setSelected(node.id);
            // setSelected(selected !== node.id ? node.id : null);
        }
    }

    // 双击打开图层配置
    treeNodeDoublClick = (node, index, e) => {
        e.stopPropagation();
        e.preventDefault();
        const { styleHelper, openActiveLayerSetting, setSelected } = this.props;
        const layer = styleHelper.getLayer(node.id);
        const isGroup = layer && layer.metadata && layer.metadata.isGroup;
        if(layer && !isGroup) {
            setSelected(node.id);
            openActiveLayerSetting(node.id);
        }
    }

    componentDidMount() {
        const {setTree} = this.props;
        setTree(this.treeWrapperRef.current);
    }

    render() {
        const { connectDropTarget, styleHelper } = this.props;
        const contents = this.getTreeNodes();
        return connectDropTarget(<div className={classNames(styles.tree)}>
            <Tree 
                ref={this.treeWrapperRef} 
                onNodeCollapse = {(node) => {
                    styleHelper.updateGroup(node.id, {isExpanded: false});
                }}
                onNodeExpand = {(node) => {
                    styleHelper.updateGroup(node.id, {isExpanded: true});
                }}
                contents={contents} 
                onNodeClick={this.treeNodeClick} 
                onNodeDoubleClick = {this.treeNodeDoublClick}
                onNodeMouseEnter={this.onNodeMouseEnter}
                 />
        </div>)
    }
}

export default DropTarget('MapLayer', types, collect)(LayerTree);