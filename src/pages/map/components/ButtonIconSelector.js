import { Component } from 'react';
import classNames from 'classnames';
import styles from './ButtonIconSelector.less';
import { Button, Popover, Position } from "@blueprintjs/core";
import IconSelect from './IconSelect';

export function ButtonIconSelector (props) {
    const { styleHelper, mapId, activeLayer, fieldKey, layerTarget } = props;
    // 图标选择
    const iconSelectPanel = <div className={styles.iconSelect}>
        <IconSelect styleHelper={styleHelper} mapId={mapId} onChange={(icon) => { 
            if(activeLayer) {
                styleHelper.updateLayer({id: activeLayer.id, [fieldKey]: icon.id}, layerTarget)
            }
            }} />
    </div>
    
    return (<Popover content={iconSelectPanel} position={Position.RIGHT_TOP} >
        <Button icon="add-to-artifact" title="选择ICON图标" minimal={true} small={true} />
    </Popover>)
}