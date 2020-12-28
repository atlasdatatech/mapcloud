import { Component } from 'react';
import classNames from 'classnames';
import {ExIcon} from '../common';
import styles from './Input.less';
import Editable from '../Editable';
import { isArray, throttle } from '../../utils/util';
import { validateFile, validateFiles } from '../../utils/file';
import { EditableText, ButtonGroup, Button, Divider, Tooltip, NumericInput,
    Callout, Card, Elevation, FormGroup, InputGroup, Icon, Intent, Slider,
    Classes, Position, Popover } from "@blueprintjs/core";

    import React from 'react';

export function OptimisticInputWrapper (component) {
    return class OptimisticInput extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                value: props.value
            }
        }

        componentWillUpdate(nextProps, nextState) {
            if (nextProps.value !== this.props.value && nextProps.value !== nextState.value) {
                this.setState({value: nextProps.value});
            }
        }

        render() {
            return React.createElement(component, Object.assign({}, this.props, {
                value: this.state.value,
                onChange: this.onChange.bind(this)
            }))
        }

        onChange(e) {
            this.setState({
                value: e.target.value
            });
            this.props.onChange && this.props.onChange(e);
        }
    }
}

function ButtonUnit(props) {
    const {minimal, small, label, icon, value, className, onClick, intent} = props;
    return (
        <Button minimal={minimal} small={small} intent={intent} className={className} onClick={() => {
            onClick(value)
        }} disabled={disabled}>{icon && <ExIcon icon={icon} />} {label}</Button>
    )
}

/**
 * 单选按钮组
 * options [{value, icon}]
 */
export function ButtonGroupRadio(props) {
    const {value, onChange, activeClass, className, minimal, disabled, options, small} = props;
    if(!isArray(options)) return null;
    return (
        <ButtonGroup minimal={minimal} className={className}>
            {options.map((option, index) => {
                return <ButtonUnit key={index} 
                    icon={option['icon']}
                    className={activeClass} 
                    small={small}
                    onClick={() => {onChange(k)}} 
                    intent={value === option['value'] && 'primary'} 
                    disabled={disabled} />
            })}
        </ButtonGroup>
    )
}

/**
 * 下拉选择控件
 * 
 */
export function Selection(props) {
    const {options, value, onChange, disabled, className, title} = props;
    const panel = (<div className={classNames("bp3-select")} disabled={disabled}>
        <select value={value} className={classNames(disabled && "bp3-disabled")} onChange={(event) => {onChange(event.target.value)}} disabled={disabled}>
            {
                options.map((op, index) => {
                    return <option key={index} value={op.value}>{op.label}</option>
                })
            }
        </select>
    </div>);
    let wrapper = null;
    if(title) {
        wrapper = <label className="bp3-label bp3-inline">
            {title}
            {panel}
        </label>
    } 
    return (
        title ? wrapper : <div className={className}>{panel}</div>
    )
}

/**
 * 输入控件
 */
export function Input(props) {
    const {value, onChange, minimal, danger, disabled, readOnly, fill} = props;
    return (
        <input className={classNames("bp3-input", 
               minimal && 'bp3-minimal', 
               fill && 'bp3-fill',
               danger && 'bp3-intent-danger'
              )} 
              type="text" 
              value={value === undefined || value === null ? '' : value} 
              spellCheck="false"
              onChange={onChange} 
              disabled={disabled}
              readOnly={readOnly}
              dir="auto" />
    )
}

function NineGridButton(props) {
    const {option, small, minimal, activeClass, onChange, value, disabled} = props;
    if(!option) return null;
    return (
        <ButtonUnit minimal={minimal} small={small} value={option['value']}
        intent={value === option['value'] && 'primary'}
        disabled={disabled}
        label={option['label']} 
        className={activeClass}
        icon={options['icon']} 
        onClick={() => {onChange(options['value'])}} />
    )
}

/**
 * 九宫格按钮
 * options [{label, value, icon}]
 */
export function NineGridSelect(props) {
    const {label, className, options, onChange, minimal, small, value} = props;
    const n1 = (<NineGridButton option={options[0]} minimal={minimal} small={small} value={value} onChange={onChange} />);
    const n2 = (<NineGridButton option={options[1]} minimal={minimal} small={small} value={value} onChange={onChange} />);
    const n3 = (<NineGridButton option={options[2]} minimal={minimal} small={small} value={value} onChange={onChange} />);
    const n4 = (<NineGridButton option={options[3]} minimal={minimal} small={small} value={value} onChange={onChange} />);
    const n5 = label;
    const n6 = (<NineGridButton option={options[4]} minimal={minimal} small={small} value={value} onChange={onChange} />);
    const n7 = (<NineGridButton option={options[5]} minimal={minimal} small={small} value={value} onChange={onChange} />);
    const n8 = (<NineGridButton option={options[6]} minimal={minimal} small={small} value={value} onChange={onChange} />);
    return (
        <table className={classNames(className)}>
            <tbody>
                <tr><td>{n1}</td><td>{n2}</td><td>{n3}</td></tr>
                <tr><td>{n4}</td><td>{label}</td><td>{n5}</td></tr>
                <tr><td>{n6}</td><td>{n7}</td><td>{n8}</td></tr>
            </tbody>
        </table>
    )
}


export function InputLabel(props) {
    const {label, onChange, className, value, note, disabled, danger, style} = props;
    return (
        <div className={classNames(className)} title={value}>
            <label className="bp3-label bp3-inline">
                {label}
                <input className={classNames("bp3-input bp3-small", disabled && 'bp3-disabled')} type="text" 
                    value={value === undefined || value === null ? '' : value} 
                    disabled={disabled}
                    danger={danger}
                    style={style}
                    onChange={(event) => { onChange(event.target.value)}} dir="auto" />
                {note && <span className="bp3-text-muted"> {note}</span>}
            </label>
        </div>
    )
}

/**
 * 组合输入框
 * options [{value, label, note}] 
 */
export function InputTextGroup(props) {
    const {onChange, className, options, inputStyle, type} = props;
    function updateChange(target) {
        const arr = [];
        for(let i = 0, len = options.length; i < len; i++) {
            if(i === target.index){
                arr[i] = type === 'number' || type ===  undefined ? 
                    Number(target.value) : target.value;
            } else {
                arr[i] = options[i].value;
            }
        }
        onChange && onChange(arr);
    }
    
    return <div className={className}>
        {options.map((option, index) => {
            return (<InputLabel key={index} style={inputStyle} 
                    value={option.value === undefined || option.value === null ? '' : option.value } 
                    label={option.label} 
                    note={option.note} 
                    onChange={(v) => {updateChange({index, value:v});
            }} />)
        })}
    </div>
}

/**
 * 组合数字输入框
 * options [{value, label, note}] 
 */
export function InputNumberGroup(props) {
    const {onChange, className, options, inputStyle, type, disabled, stepSize} = props;

    function updateChange(target) {
        const arr = [];
        for(let i = 0, len = options.length; i < len; i++) {
            if(i === target.index){
                arr[i] = target.value;
            } else {
                arr[i] = options[i].value;
            }
        }
        onChange && onChange(arr);
    }
    return <div className={className}>
        {options.map((option, index) => {
            return (<NumericInput key={index} style={inputStyle}
                    fill = {props.fill}
                    disabled = {disabled}
                    stepSize = {stepSize || 1}
                    // minorStepSize = {null}
                    // majorStepSize = {null}
                    min = {props.min}
                    leftIcon = {option.label && <span className="at-label-note">{option.label}: &nbsp;</span>}
                    value={option.value === undefined || option.value === null ? 0 : option.value } 
                    onValueChange={(v) => {updateChange({index, value:v});
            }} />)
        })}
    </div>
}

export function InputSlider(props) {
    const {containerClassName} = props;
    return (
        <div className={containerClassName} style={{padding: '3px 20px 0 20px'}}>
            <Slider {...props} />
        </div>
    )
}

// 上传组件
export function UploadInput(props) {
    const { className, onChange, limitExts, limitSize, mode } = props;

    function validateUploadFile({files}) {
        onChange && onChange({
            files, 
            isValidate: validateFiles({files, size: limitSize, exts: limitExts})
        });
    }

    return (
        <input type="file" name="file" 
            accept = {limitExts.map(e => `.${e}`)}
            multiple={mode === 'multi' && 'multiple'} className = {className}
            onChange={(e)=>{validateUploadFile({files: e.target.files})}} />
    )
}

/**
 * 过滤输入
 */
export function FilterInput(props){
    const {filterKey, onChange, placeholder} = props;
    return (
        <div className="bp3-input-group bp3-fill">
            <span className="bp3-icon bp3-icon-filter"></span>
            <input type="text" className="bp3-input" value={filterKey || ''} 
                placeholder={placeholder || "输入关键词过滤"} 
                onChange={(v) => {onChange(v.target.value)}}/>
        </div>
    )
}

/**
 * 过滤输入
 */
export function SearchInput(props){
    const {value, searchHandler, onChange, placeholder, clearSearchKey} = props;
    return (
        <div className="bp3-input-group bp3-fill">
            {/* <span className="bp3-icon bp3-icon-search"></span> */}
            <input type="search" className="bp3-input" value={value || ''} 
                autoComplete="off"
                placeholder={placeholder || "输入查询关键词"} 
                onChange={(v) => {
                    const val = v.target.value;
                    onChange(val);
                }} />
            <button className="bp3-button bp3-minimal bp3-icon-search" style={{transform: 'translateX(-5px)'}}  onClick={searchHandler}></button>
        </div>
    )
}

export class EditableWithHandle extends Component{
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
        }
    }

    startEdit = (e) => {
        e.stopPropagation();
        this.setState({edit: true});
    }

    endEdit = (e) => {
        e.stopPropagation();
        this.setState({edit: false});
        const {saveHandle} = this.props;
        if(saveHandle) {saveHandle()}
    }

    render() {
        const {onChange, disabled, placeholder, value} = this.props;
        const {edit} = this.state;
        const icon = edit ? "tick" : "edit";
        return (
            <div className={classNames(styles.etditable, 'flex-vertical')}>
                <div  className={'flex-vertical'}>
                    <input spellCheck="false"  
                        value={value} 
                        title = {value}
                        className={classNames(
                            edit ? "bp3-input bp3-fill bp3-small" : styles.disableEdit, 
                            !edit && 'text-overflow',
                            !value && "bp3-intent-warning") }
                        style = {{pointerEvents: edit ? "auto" : "none"}}
                        type="text" 
                        onChange = {(e) => {onChange && onChange(e.target.value)}}
                        readOnly = {!edit}
                        placeholder={placeholder||"请输入"} 
                        dir="auto" />
                </div>  
                <div>
                {
                    !disabled && <Button 
                        className={ edit ? styles.showBtn : styles.autoHide}
                        onClick = { edit ? this.endEdit : this.startEdit}
                        minimal={true} 
                        small={true} 
                        disabled = {disabled}
                        title = {edit ? '保存' : '修改'}
                        icon={icon} />
                }
                </div>
            </div>
            
        );
    }
}