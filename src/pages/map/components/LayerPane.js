import { Component } from 'react';
import classNames from 'classnames';
import styles from './LayerPane.less';
import {SpanIcon, ExEditableText} from '../../../components/common';
import { Tab, Tabs, Icon } from "@blueprintjs/core";
import LayerList from './layer/Layer';
import LayerSetting from './layer/Setting';

const TABS = {LIST:'list', SETTING: 'setting'};

export default class LayerPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabId: TABS.LIST, // list, setting
        }
    }

    handleTabChange = (state) => {
        this.setState({selectedTabId:state});
    }

    openActiveLayerSetting = (layerId) => {
        this.props.setActiveLayer(layerId);
        this.handleTabChange(TABS.SETTING);
    }

    render() {
        const {selectedTabId} = this.state;
        const { activeLayer, style, styleHelper, mapId} = this.props;
        const settingDisabled = !activeLayer || (activeLayer.metadata && activeLayer.metadata.isGroup);
        const listPane = selectedTabId === TABS.LIST && <LayerList className={styles.scrollPane} 
            openActiveLayerSetting={this.openActiveLayerSetting} 
            {...this.props} />;
        const settingPane = selectedTabId === TABS.SETTING && <LayerSetting handleTabChange={this.handleTabChange} {...this.props} />;
        return (
            <Tabs id="featureEditor" className={classNames(styles.tabs)}
                onChange={this.handleTabChange} selectedTabId={selectedTabId}>
                <Tab id={TABS.LIST} title={<span className={styles.span}><Icon icon="layers" /> &nbsp;图层列表</span>}  
                    panel={listPane} />
                <Tab id={TABS.SETTING} disabled={settingDisabled} 
                    title={<span className={styles.span}><Icon icon="cog" /> &nbsp;图层设置</span>} 
                    panel={settingPane} />
                <Tabs.Expander />
            </Tabs>
        )
    }
}