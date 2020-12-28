import { Component } from 'react';
import classNames from 'classnames';
import styles from './SettingPane.less';
import { EditableText, ButtonGroup, Button, Divider, Tab, Tabs, Tooltip,
    Callout, Card, Elevation, FormGroup, InputGroup, Tree, Icon, Intent,
    Classes, Position, Menu, MenuItem, Popover } from "@blueprintjs/core";
import ScrollWrapper from '../../../components/ScrollWrapper';
import {SpanIcon, SmallButton, ExIcon, ExEditableText} from '../../../components/common';
import { TypeOption, TypeOptions} from '../../../components/controls/ConfigOption';
import * as OPTIONS from '../../../const/options';
import Collapse from '../../../components/Collapse';

function getStyleKeyOptions(style, type){
    const keys = Object.keys(OPTIONS[type]);
    return keys.map((key) => {
        return {
            targetKey: `${type}`,
            target: OPTIONS[type],
            key,
            value: type === 'style' ? style[key] : (style[type] && style[type][key]),
        }
    });
}

export default class SettingPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    
    render() {
        const {style, styleHelper} = this.props;
        if(!style) return null;
        const bases = getStyleKeyOptions(style, 'style');
        const transition = getStyleKeyOptions(style, 'transition');
        const light = getStyleKeyOptions(style, 'light');
        return (
            <div className={classNames(styles.container, 'h100')}>
                <ScrollWrapper className={styles.scroll}>
                    <div className={styles.content}>
                    <Collapse title='初始化状态' icon={'&#xe62b;'} isOpen={true}>
                        <div className={styles.optionsMain}>
                            <TypeOptions options={bases} 
                            className = {{center: styles.centerInput}}
                            onChange={(e) => { 
                                styleHelper.updateMap({[e.key]: e.value});
                            }} />
                        </div>
                    </Collapse>
                    <Collapse title='过渡效果' icon={'&#xe62b;'} isOpen={false}>
                        <div className={styles.optionsMain}>
                            <TypeOptions options={transition} onChange={(e) => {
                                styleHelper.updateMap({[e.key]: e.value}, 'transition');
                            }} />
                        </div>
                    </Collapse>
                    <Collapse title='光照效果' icon={'&#xe62b;'} isOpen={false}>
                        <div className={styles.optionsMain}>
                            <TypeOptions options={light} onChange={(e) => { 
                                styleHelper.updateMap({[e.key]: e.value}, 'light') 
                            }} />
                        </div>
                    </Collapse>
                    </div>
                </ScrollWrapper>
            </div>
        )
    }
}