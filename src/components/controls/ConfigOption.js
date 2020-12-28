import { Component } from 'react';
import classNames from 'classnames';
import styles from './ConfigOption.less';
import { EditableText, ButtonGroup, Button, Divider, Tab, Tabs, Tooltip,
    Callout, Card, Elevation, FormGroup, InputGroup, Tree, Icon, Intent,
    Classes, Position, Menu, MenuItem, Popover, Switch , NumericInput} from "@blueprintjs/core";
import {SpanIcon, SmallButton, ExIcon, ExEditableText} from '../common';
import {Selection, InputTextGroup, InputLabel, InputSlider, InputNumberGroup} from './Input';
import ColorPicker from './Color';
import Option from './Option';
import * as OPTIONS from '../../const/options';
import { I18_PARAMS } from '../../const/i18';
import { isObject, isString, isNumber, isArray, hyphens2camel, guid, 
    formatNum,
    getObjectFromArray ,isValidNumber, safeNumberic} from '../../utils/util';


export class TypeOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openJsonEditor: false,
        }
    }

    setOpenJsonEditor = (state) => {
      this.setState({openJsonEditor: state});
    }

    getDefaultValue = (target, key) => {
        let defaultValue = target[key]['value'];
        let type = target[key]['type'];
        let inputType = target[key]['input'];
        if(defaultValue !== undefined && type === 'string' && inputType === 'select') {
            defaultValue = defaultValue.split('|')[0];
        }
        return defaultValue;
    }

    render() {
        const {onChange, className, lint, addOptions} = this.props;
        const {targetKey, key, value, disabled, enableJsonEditor} = this.props.option;
        // console.log(disabled)
        const targets = targetKey.split('-');
        let target = null;
        switch(targets.length) {
                case 1:
                    target = OPTIONS[targets[0]];
                    break;
                case 2:
                    target = OPTIONS[targets[0]][targets[1]];
                    break;
                case 3:
                    target = OPTIONS[targets[0]][targets[1]][targets[2]];
                    break;
        }
        if(!key || !target || !target[key] || target[key]['ignore']) return null;
        let optionValue = value;
        const defaultValue = this.getDefaultValue(target, key);
        if(optionValue === undefined) {
            optionValue = defaultValue;
        }
        let panel = <div>{optionValue}</div>;
        const type = target[key]['type'];
      let optionClassName = null;
      if(className && className[key]) {
        optionClassName = className[key];
      }
      if(((type === 'number' || type === 'string' || type === 'color') && isArray(optionValue)) || isObject(optionValue) || type === 'func<color>') {
        //   panel = <div><i>高阶表达式</i>, 请使用JSON编辑模式</div>
          panel = <Callout intent='primary' icon={'function'} className={styles.functionNotic}> 高阶表达式，请使用JSON编辑模式 </Callout>
      } else {
          // 颜色控件
          if(type === 'color') {
              panel = <ColorPicker value={optionValue} 
              disabled= {disabled}
            onChange={(color) => {onChange({targetKey, key, value:color})}} />
          }
          if(type === 'boolean') {
              let checked = optionValue;
              if(key === 'visibility') {
                checked = optionValue === 'visible';
              }
              panel = <Switch inline={true} 
                label={target[key]['note']} 
                checked={checked} 
                disabled= {disabled}
                onChange={(v) => {
                    onChange({targetKey, key, value:v.target.checked})}
                } />;
          }
          if(type === 'string' && target[key]['input'] === 'select') {
              const options = target[key]['value'].split('|').map((op) => {
                  return {
                      value: op,
                      label: I18_PARAMS[op] + ' - ' + op
                  }
              });
              panel = <Selection value={optionValue || options[0].value} 
                options={options} 
                disabled = {disabled}
                onChange={(v) => {onChange({targetKey, key, value:v})}} />
          }
          if(type === 'string' && target[key]['input'] === 'editinput') {
              panel = <ExEditableText text={optionValue} 
              disabled = {disabled}
                onChange={(v) => {onChange({targetKey, key, value:v})}} 
                showButton={true} />
          }
          if(type === 'array<number>' && target[key]['input'] === 'input') {
              const values = isArray(optionValue) ? optionValue : target[key]['value'];
              const inputLabel = target[key]['inputLabel'];
              const labels = inputLabel && inputLabel.split('|');
              const options = values.map((v, index) => {
                  return {
                      label: labels && labels[index],
                      value: safeNumberic(v),
                      note: target[key]['unit']
                  }
              });
              panel = <InputNumberGroup 
                className={classNames(styles.translateInput, optionClassName, 'flex-vertical')} 
                fill = {!!optionClassName}
                options={options} 
                disabled={disabled}
                stepSize = {target[key]['step'] || 1}
                min = {target[key]['min']}
                onChange={(v) => {
                    // key === 'line-dasharray' && v[0] === 0 && v[1] === 0 ? [5, 5] 
                    onChange({
                        targetKey, 
                        key, 
                        value: v
                    })
                }} 
                inputStyle={{width: optionClassName ? '120px' : '50px'}}
                 />
          }
          if(type === 'string'&& target[key]['input'] === 'input') {
              let _panel = <InputLabel style={{width:'120px'}} 
                label={target[key]['note']} 
                note={target[key]['unit']} 
                value={optionValue} 
                disabled = {disabled}
                onChange={(v) => {onChange({targetKey, key,value:v})}} />
             if(addOptions && addOptions[key]) {
                 panel = <div className={classNames(styles.inlineInput, 'flex-vertical')}>
                     <div>{_panel}</div>
                     <div>{addOptions[key]}</div>
                 </div>
             } else {
                 panel = _panel;
             }
          }
          if(type === 'number' && target[key]['input'] === 'input') {
            panel = <NumericInput 
                className={styles.singleNumberInput}
                fill = {true}
                disabled = {disabled}
                stepSize = {target[key]['step'] || 1}
                min = {target[key]['min']}
                max = {target[key]['max']}
                // majorStepSize = {null}
                minorStepSize = {null}
                leftIcon = {target[key]['note'] && <span className="at-label-note">{target[key]['note']}: &nbsp;</span>}
                value={optionValue} 
                intent = {(!isValidNumber(optionValue) && 'danger') || null}
                onValueChange={(v) => {onChange({targetKey, key, value: v})}} />
          }
          if(type === 'number' && target[key]['input'] === 'slider') {
              const min = target[key]['min'];
              const max = target[key]['max'];
              let stepSize = 1;
              let labelRender = null;
              let labelStepSize = max;
              if(max <= 1000) {
                  labelStepSize = max / 4;
              }
              if(max <= 500) {
                  labelStepSize = max / 2;
              }
              if(max <= 100) {
                labelStepSize = max;
            }
              if(target[key]['unit']) {
                  labelRender = (v) => {
                      return Math.round(v) + target[key]['unit'];
                  }
              }
              
              if(min >= -1 && max <= 1) {
                  stepSize = (max - min) / 20;
                  labelRender = (v) => {
                      return Math.round(v * 100) + '%';
                  }
                  labelStepSize = 1;
              }
              if(min >= 0 && max <= 1) {
                stepSize = 0.01;
              }
              panel = <InputSlider 
                    stepSize={stepSize} 
                    labelStepSize={labelStepSize} 
                    labelRenderer={labelRender}
                    disabled = {disabled}
                    value={formatNum(optionValue, 2)} 
                    onChange={(v) => {
                        onChange({targetKey, key, value:formatNum(v, 2)})
                    }} 
                    min={min} 
                    max={max} />
          } 
      }
  
  
      let jsonObject = {[key]: optionValue};
      if(key === 'name' && type === 'layer') {
          jsonObject = {metadata: {[key]: optionValue}}
      }

      return (
          <Option openJsonEditor={this.state.openJsonEditor} 
                handleJsonEditor={this.setOpenJsonEditor}
                jsonChange ={(newJson) => { 
                        onChange({targetKey, key, value:newJson[key]}) ;
                    }}
              title={`${target[key]['label']} ${target[key]['unit'] ? '- ' + target[key]['unit']  : ''}`} 
              jsonObject={jsonObject && jsonObject} 
              enableJsonEditor = {enableJsonEditor}
              tip={target[key]['title']}
              panel={panel} 
              lint = {lint}
              setDefaultHandle={() => {onChange({targetKey, key, value: defaultValue}) }} />
      )
    }
}


/**
 * 静态配置项生成
 * @param {*} props 
 * [{targetKey, key, value}]
 * 
 */
export function TypeOptions(props) {
    const {options} = props;
    if(!options) return null;
    return options.map((option, index) => {
        return <TypeOption key={option.targetKey + '-' + index} option={option} {...props} />
    });
}