import { Component } from 'react';
import classNames from 'classnames';
import styles from './Collapse.less';
import { Collapse, Button, Card, Elevation, Icon } from "@blueprintjs/core";
import {ExIcon} from './common';

export default class CollapseArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen !== undefined ? props.isOpen : true,
        }
    }

    toggleOpen = (e) => {
        e.stopPropagation();
        const {isOpen} = this.state;
        this.setState({isOpen:!isOpen});
        const {onChange} = this.props;
        if(onChange) {
            onChange(!isOpen);
        }
    }

    render() {
        const {isOpen} = this.state;
        const {title, icon, className, rightPanel, preTitlePanel} = this.props;
        return (
            <Card elevation={Elevation.ONE} className={classNames(styles.container, className)}>
                <div className={styles.collapse}>
                    <div onClick={this.toggleOpen}>
                        <div>
                            {preTitlePanel}
                            {/* <h5 className="text-overflow">{ icon ? <ExIcon icon={icon} /> : null} {title}</h5> */}
                            <h5 className="text-overflow">{title}</h5>
                        </div>
                        <div>
                            {rightPanel}
                            <Button minimal='true' small='true' 
                                icon={!isOpen ? 'caret-down' : 'caret-up'} onClick={this.toggleOpen}>
                            </Button>
                        </div>
                    </div>
                    <Collapse isOpen={isOpen}>
                        {this.props.children}
                    </Collapse>
                </div>
            </Card>
        )
    }
}