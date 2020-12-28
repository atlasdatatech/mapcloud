// import {contain} from './util';

export const FIELD_TYPE = {
    string: '字符',
    number: '数值',
    datetime: '日期时间',
    int: '整数',
    float: '浮点数',
    bool: '布尔值',
    date: '日期'
};

export function getFieldType(type, cn) {
    type = type.toLowerCase();
    if('string'.indexOf(type) >= 0) return cn ? FIELD_TYPE['string'] : 'string';
    if('number|float|double|int|integer'.indexOf(type) >= 0) return cn ? FIELD_TYPE['number'] : 'number';
    if('datetime|date|time'.indexOf(type) >= 0) return cn ? FIELD_TYPE['datetime'] : 'datetime';
    if('bool|boolean'.indexOf(type) >= 0) return cn ? FIELD_TYPE['bool'] : 'bool';
    return cn ? FIELD_TYPE['string'] : 'string';
}

export function getFieldTypeIntent(type, cn) {
    const _type = getFieldType(type, cn);
    switch(_type) {
        case '字符':
            return 'primary';
        case '日期时间':
            return 'waring';
        case '数值':
            return 'success';
        case '布尔值':
            return 'error';
    }
    return 'primary';
}