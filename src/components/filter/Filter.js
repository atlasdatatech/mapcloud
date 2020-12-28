import { Component } from 'react';
import classNames from 'classnames';
import styles from './Filter.less';
import { Button, Slider, RangeSlider, Switch } from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
import { ExIcon} from '../common';
import Select from 'react-select';

const TYPE_ICON = {
    string: 'S',
    number: 'N',
    boolean: 'B',
    datetime: 'D'
};

function Layout(props) {
    const {name, type, closeHandle} = props;
    if(!name || !type) return null;
    return (<div className={styles.filter}>
        <div>
            <div>
                <span>{TYPE_ICON[type.toLowerCase()]}</span>
                <h5>{props.name}</h5>
            </div>
            <div>
                {
                    closeHandle && 
                    <Button minimal='true' small='true' onClick={closeHandle}>
                        <ExIcon icon='&#xe62b;' />
                    </Button>
                }
            </div>
        </div>
        <div>
            {props.children}
        </div>
    </div>)
}

// 布尔值过滤项
function BooleanFilter(props) {
    const {name, closeHandle, checked, onChange } = props;
    return (
        <Layout type='boolean' name={name} closeHandle={closeHandle}>
            <Switch checked={checked} onChange={onChange} />
        </Layout>
    )
}

// 数值过滤项：区间值
function NumbericalFilterByRangeSlider(props) {
    const {name, closeHandle } = props;
    return (
        <Layout type='number' name={name} closeHandle={closeHandle}>
            <RangeSlider {...props} />
        </Layout>
    )
}

// 数值过滤项：单值
function NumbericalFilterBySlider(props) {
    const {name, closeHandle } = props;
    // props: min, max, value, onChange, value, labelRenderer
    return (
        <Layout type='number' name={name} closeHandle={closeHandle}>
            <Slider {...props} />
        </Layout>
    )
}

const SelectStyle = {
    option: (provided, state) => ({
      ...provided,
    //   borderBottom: '1px dotted pink',
    //   color: state.isSelected ? 'red' : 'blue',
    //   padding: 20,
        // color: 'white'
    }),
    container: (provided) => ({
        ...provided,
        // color: 'white'
    }),
    control: (provided) => ({
        ...provided,
        minHeight: '25px',
    }),
    dropdownIndicator:  (provided) => ({
        ...provided,
        padding: '0 3px'
    }),
};

// 字符型过滤项
function StringFilter(props) {
    const {name, // 字段名称
        closeHandle, // 关闭事件
        value, // 已选值
        values, // 可选值
        onChange  // 更新事件
    } = props;
    // values [{type, label, value}]
    return (
        <Layout type='string' name={name} closeHandle={closeHandle}>
            <Select 
                options={values} 
                value={value}
                styles = {SelectStyle}
                isMulti = {true}
                className='super-select-container'
                classNamePrefix = 'super-select'
                placeholder = '请选择...'
                onChange={(v) => { onChange({values: v, type: 'string'}) }}
                noOptionsMessage = {() => { return '没有选项了'}}
            />
        </Layout>
    )
}

// 日期时间过滤项
function DatetimePickerRangeFilter(props) {
    const {name, 
        closeHandle, 
        min, 
        max, 
        start, 
        end, // 结束
        onChange, // 更新时间
        precision, // 日期精度, second, hour
        disabled, // 禁止
     } = props;
    return (
        <Layout type='datetime' name={name} closeHandle={closeHandle}>
            <h6>起始时间</h6>
            <DateInput
                formatDate={date => date.toLocaleString()}
                onChange={(e) => {onChange && onChange({start: e})}}
                parseDate={str => new Date(str)}
                placeholder={"YYYY-MM-DD HH:mm:ss"}
                timePrecision = { precision || 'second'}
                value={start}
                minDate={min}
                maxDate={max}
                disabled={disabled}
            />
            <h6>结束时间</h6>
            <DateInput
                formatDate={date => date.toLocaleString()}
                onChange={(e) => {onChange && onChange({end: e})}}
                parseDate={str => new Date(str)}
                placeholder={"YYYY-MM-DD HH:mm:ss"}
                timePrecision = { precision || 'second' }
                value={end}
                minDate={min}
                maxDate={max}
                disabled={disabled}
            />
        </Layout>
    )
}

// 日期时间过滤项：区间值滑块
function DatetimeSliderRangeFilter(props) {
    const {name, closeHandle } = props;
    return (
        <Layout type='number' name={name} closeHandle={closeHandle}>
            <RangeSlider {...props} />
        </Layout>
    )
}