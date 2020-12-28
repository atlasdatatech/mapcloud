import React, { Component } from 'react';
import classNames from 'classnames';
import { EditableWithHandle} from '../../../../components/controls/Input';
import styles from './LayerLabel.less';
import { DragSource } from "react-dnd";
import { removeTreeHoverClass} from '../../../../utils/dom';

const layerSource = {
    beginDrag(props, monitor, component) {
        return {
            id: props.id,
            type: props.type,
            treeClassName: props.treeClassName
        };
    },
    endDrag(props, monitor) {
        const dropResult = monitor.getDropResult();
        // 清除未能拖放的目标样式
        if(!dropResult) {
            removeTreeHoverClass(props.treeClassName);
        }
    },
    isDragging(props, monitor) {
        
    }
};
      
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

// const ref = React.createRef();

const _LayerLabel = React.forwardRef((props, ref) => {
        const { onChange, icon, name, treeClassName } = props;
        const { isDragging, connectDragSource } = props;
        return connectDragSource(
            <div className={classNames(styles.layerTitle, 'flex-vertical')} 
                ref= {ref}
                style={{ opacity: isDragging ? 0.3 : 1 }}>
                <div>
                    {icon}
                </div>
                <div>
                    <EditableWithHandle 
                        value={name} 
                        onChange={(e) => {onChange && onChange(e)}}  />
                </div>
        </div>)
});

export default DragSource("MapLayer", layerSource, collect)(_LayerLabel);