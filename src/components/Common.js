import {Component} from 'react';
import classNames from 'classnames';
import styles from './Common.less'
import Editable from './Editable';
import { Icon } from "@blueprintjs/core";

export function ExIcon(props) {
    const {icon} = props;
    return (
        <i className="iconfont" dangerouslySetInnerHTML={{__html: icon}} {...props}></i>
    )
}

export function IconText(props) {
    const {icon, text} = props;
    return (
        <div className="flex-vertical">
            <Icon icon={icon} {...props} />
            <span style={{marginLeft: '5px'}}>{text}</span>
        </div>
    )
}

export function SpanIcon(props) {
    const {icon, text, className, title} = props;
    return (
        <span className={className} title={title}>
            <i className="iconfont" dangerouslySetInnerHTML={{__html: icon}}></i> {text}
        </span>
    )
}

export function SmallButton(props) {
    const {icon, text, className, title, onClick} = props;
    return (
        <span className={classNames(className, 'at-small-btn')} href='javascript:;' onClick={onClick}>
            <i className="iconfont" dangerouslySetInnerHTML={{__html: icon}}></i> {text}
        </span>
    )
}


export class ExEditableText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {showButton, disabled} = this.props;
        return (
            <div className={classNames(styles.editTitle, 'flex-vertical', showButton && styles.showBtn)}>
                <Editable spellCheck="false" {...this.props} disabled={disabled} />
                {
                    showButton && <Icon icon='edit' />
                }
            </div>
        );
    }
}
