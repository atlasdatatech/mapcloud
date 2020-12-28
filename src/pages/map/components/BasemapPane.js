import { Component } from 'react';
import classNames from 'classnames';
import styles from './BasemapPane.less';
import { EditableText, ButtonGroup, Button, Divider, Tab, Tabs, Tooltip,
    Callout, Card, Elevation, FormGroup, InputGroup, Tree, Icon, Intent,
    Classes, Position, Menu, MenuItem, Popover } from "@blueprintjs/core";
import ScrollWrapper from '../../../components/ScrollWrapper';
import {SpanIcon, SmallButton, ExIcon, ExEditableText} from '../../../components/common';
import ColorSetting from './basemap/Color';

export default class BasemapPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabId: 'color',
            layers: [
                {id:'123', color: '#f6d', name: 'layerName', },
                {id:'1234', color: '#f6d', name: 'layerName', },
                {id:'1235', color: '#f6d', name: 'layerName', },
                {id:'1236', color: '#f6d', name: 'layerName', },
                {id:'1237', color: '#f6d', name: 'layerName', },
                {id:'1238', color: '#f6d', name: 'layerName', },
            ]
        }
    }

    handleTabChange = (state) => {
        this.setState({selectedTabId: state});
    }

    render() {
        const {selectedTabId} = this.state;
        const colorPane = (<ColorSetting />);
        const otherPane = <div></div>;
        return (
            <Tabs id="featureEditor" className={classNames(styles.tabs)}
                onChange={this.handleTabChange} selectedTabId={selectedTabId}>
                <Tab id='color' title={<SpanIcon className={styles.span} text='底图样式' title='底图样式' icon='&#xe62b;' />} 
                    panel={colorPane} />
                <Tab id='other' title={<SpanIcon className={styles.span} text='其它配置项' title='底图其它配置项' icon='&#xe62b;' />} 
                    panel={otherPane} />
                <Tabs.Expander />
            </Tabs>
        )
    }

}