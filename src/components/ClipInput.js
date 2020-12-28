import {Component} from 'react';
import classNames from 'classnames';
import styles from './Common.less';
import { Popover, Tooltip, Button  } from "@blueprintjs/core";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ExIcon } from './common';

export default class ClipInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            tooltipOpen: false,
        }
    }

    toolTipDelay = () => {
        const {delayTooltip} = this.props;
        setTimeout(() => {
            this.setState({tooltipOpen: false});
        }, delayTooltip || 2000);
    }

    render() {
        const {value, className} = this.props;
        const {copied, tooltipOpen} = this.state;
        return (
            <Tooltip content='已复制到剪切板' isOpen={tooltipOpen} onOpened={() => {}} position='top' onOpened={this.toolTipDelay}>
                <div className={classNames("bp3-input-group bp3-fill", className)}>
                        <input type="text" className="bp3-input" value={value} onChange={() => {}} spellCheck={false} />
                    <CopyToClipboard text={value} onCopy={() => this.setState({copied: true, tooltipOpen: true})}>
                        <Button minimal={true} icon={copied ?　'clipboard' : 'duplicate'} title='点击复制链接'>
                        </Button>
                    </CopyToClipboard>
                </div>
            </Tooltip>
        )
    }
}