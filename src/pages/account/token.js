import { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Button, Card, Elevation, FormGroup, InputGroup, Icon, TextArea, Tooltip } from "@blueprintjs/core";
import { HelpListComponent } from '../../components/Help';
import layoutStyles from '../../styles/common/mainLayout.less';
import Toaster from '../../components/Toaster';
import Local from '../../utils/local';
import {IconText} from '../../components/common';
import {CopyToClipboard} from 'react-copy-to-clipboard';


export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            tooltipOpen: false
        }
    }

    toolTipDelay = () => {
        const {delayTooltip} = this.props;
        setTimeout(() => {
            this.setState({tooltipOpen: false});
        }, delayTooltip || 2000);
    }


    render() {
        const token = Local.getAccessToken();
        const {copied, tooltipOpen} = this.state;
        return (
            <div className="clearfix">
                <div className={classNames(layoutStyles.main, styles.main)} style={{float:'right', marginRight:'0px'}}>
                <Card  elevation={Elevation.THREE} className='pd-5 mgb-5'>
                        <h3 className='mgb-3'>
                             <IconText icon="key" text="密钥 AccessToken" />
                            </h3>
                        <div className='row pd-0'>
                        <TextArea
                            large={true}
                            value={token}
                            readOnly = {true}
                            style={{width:'100%', height: '80px', color: '#888'}}
                        />
                        </div>
                        <div className="mgt-3 text-right">
                        <Tooltip content='已复制到剪切板' isOpen={tooltipOpen} onOpened={() => {}} position='top' onOpened={this.toolTipDelay}>
                        <CopyToClipboard text={token} onCopy={() => this.setState({copied: true, tooltipOpen: true})}>
                            <Button intent='primary'  icon={copied ?　'clipboard' : 'duplicate'} text='复制密钥'>
                            </Button>
                        </CopyToClipboard>
                        </Tooltip>
                        </div>
                    </Card>
                    
                </div>
                <div className={classNames(layoutStyles.side, 'pd-2 at-side')}>
                    <HelpListComponent type='ACCOUNT' />
                </div>
                
            </div>
        )
    }
}