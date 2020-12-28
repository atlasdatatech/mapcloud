import React, { Component } from "react";
import classNames from "classnames";
import { Button, Callout, ButtonGroup } from "@blueprintjs/core";
import styles from './JsonEditor.less';
import CodeMirror from '../utils/codemirror';
import { isJsonString, isGeoJsonObject, isObject } from '../utils/util';

export default class JsonEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showJsonNotice: false, // 是否显示 json 提示
            isValidJson: true, // 是否合法JSON
            editor: null, // 编辑器实例
            styleMessage: '样式校验成功',
            lintSwitch: false,
        };
        this.paneRef = React.createRef();
    }

    setEditorValue = (val) => {
        const {editor} = this.state;
        if(!editor || !val || !isObject(val)) return; 
        editor.setValue(JSON.stringify(val, null, 2));
    }

    formatEditor = () => {
        const {editor} = this.state;
        if(!editor) return;
        const val = editor.getValue();
        if(!isJsonString(val)) return;
        editor.setValue(JSON.stringify(JSON.parse(val), null, 2));
    }

    editorSetResize = () => {
        const {editor} = this.state;
        const {resize} = this.props;
        if(!editor || !resize) return;
        const height = this.paneRef.current.clientHeight;
        editor.setSize('auto', height - 50);
    }

    componentDidMount() {
        window.addEventListener('resize', this.editorSetResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.editorSetResize);
    }

    saveResult = () => {
        const {editor} = this.state;
        const {saveHandle} = this.props;
        const value = editor.getValue();
        this.setState({lintSwitch: true});
        if(isJsonString(value)) {
            saveHandle && saveHandle(JSON.parse(value));
        }
    }

    render() {
        const editorOption = {
            mode: 'application/json',
            theme: 'material',
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            styleActiveLine: true,
        };

        const {jsonObject, onChange, height, width, handleCodeEditor, lint, saveHandle} = this.props;
        const {isValidJson, showJsonNotice, lintSwitch} = this.state;
        let intent = isValidJson ? 'success' : 'danger';
        let message = isValidJson ? '有效输入' : '无效输入';
        // 叠加校验 {isValid, success, error}
        if(lint && lintSwitch) {
            intent = intent.isValid ? 'success' : 'danger';
            message = intent.isValid ? lint.success: lint.error
        }
        return (
            <div className={classNames(styles.editor)} 
                style={{width: width || 'auto', height:height || '100%'}}
                ref={this.paneRef} >
                <div>
                    <CodeMirror
                        className = {styles.code}
                        value={JSON.stringify(jsonObject, null, 2)}
                        options={editorOption}
                        onChange={(editor, data, value) => {
                            // 显示JSON格式是否正确的提示
                            const {showJsonNotice} = this.state;
                            if(!showJsonNotice) {
                                this.setState({showJsonNotice: true});
                            }
                            const _isValidJson = isJsonString(value);
                            this.setState({isValidJson: _isValidJson});
                            if(_isValidJson) {
                                onChange && onChange(JSON.parse(value));
                            } 
                            this.setState({lintSwitch: false});
                        }}
                        editorDidMount={(editor) => {this.setState({editor});
                            editor.setSize('auto', height ? height - 50 : 'auto');
                            handleCodeEditor && handleCodeEditor(editor)
                        }}
                    />
                </div>
                <div className={styles.head}>
                    <div>
                        {showJsonNotice && <Callout intent={intent}>
                            {message}
                        </Callout>}
                    </div>
                    <div>
                        <ButtonGroup >
                            <Button disabled={!isValidJson} className='mgb-1' icon="diagram-tree" title="格式化"
                                onClick={this.formatEditor} />
                        {
                            saveHandle && 
                            <Button disabled={!isValidJson} className='mgb-1' icon="floppy-disk" title="保存" onClick={this.saveResult} />
                        }
                            </ButtonGroup>
                    </div>
                </div>
        </div>
        )
    }
}