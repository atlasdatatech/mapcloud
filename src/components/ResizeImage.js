import { Component } from 'react';
import classNames from 'classnames';
import styles from './ResizeImage.less';
import { IResizeEntry, ResizeSensor } from "@blueprintjs/core";

export default class ResizeImage extends Component {
    constructor(props) {
        super(props);
    }

    handleResize = (entries) => {
        const {onChange} = this.props;
        // console.log(entries.map(e => `${e.contentRect.width} x ${e.contentRect.height}`))
        if(onChange) {
            // onChange({width: })
        }
    }

    render() {
        const {width, height, src, onChange} = this.props;
        return (
            <ResizeSensor onResize={this.handleResize}>
                <div style={{ width: width + 'px', height: (height + 30)+ 'px' }}>
                    <img src={src} width={width} height={height} />
                </div>
            </ResizeSensor>
        )
    }
}