import { Component } from 'react';
import classNames from 'classnames';
import styles from './ButtonFieldSelect.less';
import { Button, Popover, Position } from "@blueprintjs/core";
import FieldSelect from './FieldSelect';

export class ButtonFieldSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFieldSelect: false,
        }
    }

    render() {
        const { styleHelper, mapId, activeLayer, fieldKey, layerTarget} = this.props;
        const {showFieldSelect} = this.state;
        // 过滤字段选择面板
        const selectFieldPanel = (<div className={styles.fieldWrapper}>
            {showFieldSelect && <FieldSelect
                layer = {activeLayer} 
                showFilterTypeSelector={true} 
                onChange={(field) => { 
                    if(activeLayer) {
                        styleHelper.updateLayer({id: activeLayer.id, [fieldKey]: `{${field.name}}`}, layerTarget)
                    }
                }}
                {...this.props}
            />}
        </div>);
        
        return (<Popover content={selectFieldPanel} position='right-top' onOpening={() => {
            this.setState({showFieldSelect: true})
        }}>
            <Button minimal='true' title="选择字段" small='true' icon="add-to-artifact" />
        </Popover>)
    }
}
