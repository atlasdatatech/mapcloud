import { Component } from 'react';
import classNames from 'classnames';
import styles from './FieldSelect.less';
import ScrollWrapper  from './ScrollWrapper';
import { ExIcon } from './common';
import { Selection, FilterInput } from './controls/Input';
import { Button, Divider, Icon } from "@blueprintjs/core";
import {I18_PARAMS} from '../const/i18';
import {getFieldType, getFieldTypeIntent} from '../utils/data';
import {isArray} from '../utils/util';
import BlankCreate from './BlankCreate';
import {ToasterWarning} from './Toaster';


/**
 * 属性选择组件
 */

export default class FieldSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterKey: '',
            filterType: 'all',
            fields: []
        }
    }

    getOptions = (field) => {
        if(!field) return null;
        let exps = ['has', '!has', 'in', '!in', '!=', '==', '<', '<=', '>', '>='];
        switch(getFieldType(field.type)) {
            case 'number':
            case 'datetime':
                exps  = ['has', '!has', 'in', '!in', '!=', '==', '<', '<=', '>', '>='];
                break;
            case 'string':
                exps  = ['has', '!has', 'in', '!in', '!=', '=='];
                break;
            case 'boolean':
                exps  = ['has', '!has', '!=', '=='];
                break;
        }
        return exps.map((exp) => {
            return {
                label: I18_PARAMS[`ex-${exp}`],
                value: exp
            }
        })
    }

    // 更新过滤字段
    updateExpFilter = ({name, type, exp}) => {
        const {fields} = this.state;
        fields.forEach((field) => {
            if(field.name === name && field.type === type) {
                field.exp = exp;
            }
        });
        this.setState({fields});
    }

    getFilterExpFromLayer = ({name}) => {
        const {layer} = this.props;
        if(layer && layer.filter && isArray(layer.filter)) {
            return layer.filter.filter(f => isArray(f) && f[1] === name).map(f => {
                return {
                    name: f[1],
                    exp: f[0],
                }
            })
        }
        return [];
    }

    updateList = () => {
        const {layer, styleHelper, showFilterTypeSelector} = this.props;
        if(!layer || !styleHelper) return;
        styleHelper.fetchSourceFieldsByLayer(layer.id).then((fields) => {
            if(showFilterTypeSelector) {
                fields.forEach((field) => {
                    const exsitFilter = this.getFilterExpFromLayer({name:field.name});
                    if(exsitFilter.length > 0) {
                        // console.log(exsitFilter);
                    }
                });
            }
            this.setState({fields: fields.map(f => {
                f.exp = 'has';
                return f;
            })});
        }).catch((error) => {
            this.setState({fields: []});
            ToasterWarning({message: error});
        });
    }

    componentDidMount() {
        this.updateList();
    }

    render() {
        const {
            filterKey, 
            filterType, 
            fields // [{name, type, exp}]
        } = this.state;
        const { 
            showFilterTypeSelector, // 操作符选择
            onChange, // 添加事件
        } = this.props;
        if(!fields || !fields.length) return null;
        const filterFields = (fields || []).filter((f) => {return f.name.toLocaleLowerCase()
            .indexOf(filterKey.toLocaleLowerCase()) >= 0
            && (filterType === 'all' || (filterType !== 'all' && getFieldType(f.type) === filterType))});
        const typeOptions = [
            {label:'全部类型', value:'all'},
            {label:'数值型', value:'number'},
            {label:'字符', value:'string'},
            {label:'日期时间', value:'datetime'},
            {label:'布尔', value:'boolean'},
        ];

        return (
            <div className={classNames(styles.main, 'h100',this.props.className)}>
                <div>
                    <div className={classNames(styles.filter, 'flex-vertical')}>
                        <div className="flex-vertical">
                            <div>
                            <FilterInput filterKey={filterKey} onChange={(v) => {
                                this.setState({filterKey: v})
                            }} />
                            </div>
                            <div>
                                <Selection options={typeOptions} onChange={(v) => {
                                    this.setState({filterType: v})
                                }} />
                            </div>
                        </div>
                        <div>
                            {filterFields.length} 个字段
                        </div>
                    </div>
                </div>
                <ScrollWrapper className={styles.scroll}>
                    <div className={styles.scrollContent}>
                        <ul>
                            {
                                filterFields.map((field, index) => {
                                    const cnType = getFieldType(field.type, true);
                                    const intent = `bp3-tag bp3-intent-${getFieldTypeIntent(field.type, true)}`;
                                    return <li key={index} className={'flex-vertical'}>
                                        <div className="flex-vertical">
                                            <div><Icon icon="key" /></div>
                                            <div className={styles.type}>
                                                <span className={intent}>{cnType}</span>
                                            </div>
                                            <div className={classNames(styles.title, "text-overflow")}>{field.name}</div>
                                        </div>
                                        <div>
                                            {showFilterTypeSelector && <div>
                                                <Selection options={this.getOptions(field)} 
                                                    onChange={(e) => {this.updateExpFilter(
                                                        {name: field.name, type: field.type, exp: e}
                                                    )}} />
                                            </div>
                                            }
                                            <Button small='true' icon="plus"
                                                onClick={(e) => { onChange && onChange(field) }} />
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                        {
                            filterFields.length === 0 && <BlankCreate className="pt-2 pt-2" desc="没有匹配条件的字段" />
                        }
                    </div>
                </ScrollWrapper>
            </div>
        )
    }
}