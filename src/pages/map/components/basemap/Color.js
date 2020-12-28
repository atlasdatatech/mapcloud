import { Component } from 'react';
import classNames from 'classnames';
import styles from './Color.less';
import { EditableText, ButtonGroup, Button, Divider, Tab, Tabs, Tooltip,
    Callout, Card, Elevation, FormGroup, InputGroup, Tree, Icon, Intent,
    Classes, Position, Menu, MenuItem, Popover } from "@blueprintjs/core";
import ScrollWrapper from '../../../../components/ScrollWrapper';
import {SpanIcon, SmallButton, ExIcon, ExEditableText} from '../../../../components/common';

const testData = [];
for(var i = 0;i < 6; i++) {
    testData.push({id:i + 1, name: 'TEST-ID' + (i+1), source: 'souree', thumnail: '', type: 'line', color: '#888'});
}

export default class BasemapColorSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: testData
        }
    }

    render() {
        const {layers} = this.state;
        return (
            <div className={classNames(styles.main, 'h100')}>
                <ScrollWrapper className={styles.scroll}>
                    <div className={styles.scrollContent}>
                        <ul>
                            {
                                layers.map((layer, index) => {
                                    return (
                                        <li key={index}>
                                            <Card interactive={false} elevation={Elevation.ONE}>
                                                <div className={classNames(styles.card, 'flex-vertical')}>
                                                    <div style={{backgroundColor: layer.color}}></div>
                                                    <div>
                                                        <h5 className='text-overflow'>{layer.name}</h5>
                                                        <div>
                                                            <Button minimal='true' small='true'>
                                                                <i className="iconfont">&#xe62b;</i>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </ScrollWrapper>
            </div>
        )
    }
}