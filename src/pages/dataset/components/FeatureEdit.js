import { Component } from 'react';
import classNames from 'classnames';
import styles from './FeatureEdit.less';
import BlankCreate from '../../../components/BlankCreate';
import ScrollWrapper from '../../../components/ScrollWrapper';
import JsonEditor from '../../../components/JsonEditor';
import { ButtonGroup, Button, Divider, Tab, Tabs } from "@blueprintjs/core";

export default class FeatureEditPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabId: 'form',
        }
    }

    handleTabChange = (state) => {
        this.setState({selectedTabId: state});
    }

    render() {
        const { selectedTabId } = this.state;
        const { feature, onChange } = this.props;
        if(!feature) return null;
        const keys = (feature && feature.properties && Object.keys(feature.properties)) || [];
        // 属性编辑面板
        const FormEditorPane = feature && (<ScrollWrapper className={styles.paneScroll}>
            <div className={classNames(styles.formEditorPane)}>
                <ul>
                    {keys.map((key) => {
                        return (
                            <li key={key}>
                                <input value={key} onChange={() => {}} 
                                    className="bp3-input" type="text" placeholder="字段名" dir="auto" />
                                <input value={properties[key]} onChange={() => {}} 
                                    className="bp3-input" type="text" placeholder="值" dir="auto" />
                                <Button minimal={true}>
                                    <i className="iconfont">&#xe62b;</i>
                                </Button>
                            </li>
                        )
                    })}
                </ul>
            <div className='text-center' className={styles.addBtn}>
                <Button intent='primary'>
                    <i className="iconfont">&#xe62b;</i> 添加属性
                </Button>
            </div>
            {keys.length === 0 && <BlankCreate>
                <p className={styles.blankNote}>属性包含字段名和值，字段名不可为空，值可以是字符串或数字。
                单击 GeoJSON 选项卡进行高级编辑。</p></BlankCreate> }
        </div></ScrollWrapper>);

        const GeoJSONEditorPane = feature && (<ScrollWrapper className={styles.paneScroll}>
            <JsonEditor height={300} jsonObject={feature} onChange={(obj) => {
                // console.log(obj)
                }} />
        </ScrollWrapper>);
        
        return (
            <div>
                <div className={classNames(styles.featureHeader, 'clearfix mgb-1')}>
                    <div className='flex-vertical'>
                        <h5 className='text-overflow'>元素信息</h5>
                    </div>
                    <div className='flex-vertical'>
                        <ButtonGroup alignText='right' minimal={true}>
                            <Button><i className="iconfont">&#xe62b;</i></Button>
                            <Button><i className="iconfont">&#xe62b;</i></Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className={classNames(styles.featureInfo, 'mgb-1')}>
                    <table>
                        <tbody>
                            <tr><td>ID</td></tr>
                            <tr><td>399073a95c956e75c6f9fdcd413d7b6b</td></tr>
                            <tr><td>位置</td></tr>
                            <tr><td>123</td></tr>
                        </tbody>
                    </table>
                </div>
                <Divider/>
                <Tabs id="featureEditor" className={classNames(styles.tabs)}
                    onChange={this.handleTabChange} selectedTabId={selectedTabId}>
                    <Tab id='form' title='元素属性' className={styles.tab} panel={FormEditorPane} />
                    <Tab id='editor' title='GeoJSON' className={styles.tab} panel={GeoJSONEditorPane} />
                    <Tabs.Expander />
                </Tabs>
            </div>
        );
    }

}