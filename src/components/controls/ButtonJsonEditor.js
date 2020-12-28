import { Component } from 'react';
import { Button, Popover } from "@blueprintjs/core";
import {ExIcon} from '../common';
import styles from './ButtonJsonEditor.less';
import JsonEditor from '../JsonEditor';

export default class ButtonJsonEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openJsonEditor: false,
        }
    }

    render () {
        const { jsonObject, onChange, className, position, style, height, handleJsonEditor, lint } = this.props;
        const { openJsonEditor } = this.state;
        const editor = jsonObject && (<div className={className} style={style}>
            <JsonEditor 
                jsonObject={jsonObject} 
                width = {300}
                lint = {lint}
                saveHandle={onChange} 
                height={height} />
        </div>);
        const isOpen = openJsonEditor ||  this.props.openJsonEditor === true || (openJsonEditor === false && undefined);
        return (
            <Popover content={editor} position={position || 'right'} 
                isOpen={isOpen}
                onOpened={() => { 
                // this.setState({openJsonEditor: false}); 
                // handleJsonEditor && handleJsonEditor(false);
             }}
                >
                <Button small='true' minimal='true' icon="code" title="JSON高级编辑模式"></Button>
            </Popover>
        )
    }

}