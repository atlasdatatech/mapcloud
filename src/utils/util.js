import NumberFormat from 'react-number-format';
    import dayjs from 'dayjs';

    export function trim(str) {

        if (!isString(str)) { return str; }

        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    export function splitWords(str) {
        return trim(str).split(/\s+/);
    }

    function type(o, t) {
        return (Object.prototype.toString.call(o) === `[object ${t}]`);
    }

    export function isArray(obj) { return type(obj, 'Array'); }

    export function isBoolean(obj) { return type(obj, 'Boolean'); }

    export function isString(obj) { return type(obj, 'String'); }

    export function isNumber(obj) { return type(obj, 'Number'); }

    export function isFunction(obj) { return type(obj, 'Function'); }

    export function isObject(obj) { return type(obj, 'Object'); }

    export function isEmptyObject(e) {
        if (!isObject(e) || e === undefined) return false;

        for (const t in e) {
            return !1;
        }

        return !0;
    }

    export function cloneJson(json) {
        return JSON.parse(JSON.stringify(json || {}));
    }

    
    export  function getType(val) {
        if (val instanceof Number) {
            return 'number';
        } else if (val instanceof String) {
            return 'string';
        } else if (val instanceof Boolean) {
            return 'boolean';
        } else if (Array.isArray(val)) {
            return 'array';
        } else if (val === null) {
            return 'null';
        } else {
            return typeof val;
        }
    }


    export function isValidNumber(obj) {
        if(isNaN(Number(obj))) return false;
        return Number.isFinite ? Number.isFinite(+obj) : isFinite(+obj);
        return false;
    }

    export function safeNumberic(value) {
        if(String(value) === '-') return -1;
        if(isValidNumber(value)) return Number(value);
        if(isString(value) && value !== '-') return Number(value.replace(/[^\d]/g,''));
        return 0;
    }

    export function formatNum(num, digits) {
        let pow = Math.pow(10, (digits === undefined ? 6 : digits));
        return Math.round(num * pow) / pow;
    }

    export function mixin(obj, sources) {
        if (isObject(sources)) {
            for (const key in sources) {
                if (isObject(sources[key])) {
                    if (!isObject(obj[key])) {
                        obj[key] = {};
                    }
                    mixin(obj[key], sources[key]);
                } else {
                    obj[key] = sources[key];
                }
            }
        }

        return obj;
    }

    export function mixins(obj, sourcesArr) {
        if (isArray(sourcesArr)) {
            sourcesArr.forEach((source) => { mixin(obj, source); });
        }

        return obj;
    }

    export function getObjectFromArray(arr, key, value, index) {
        // return arr.filter((i) => i[key] === value)[0];
        if (!arr || !arr.length || !key) return;
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i] && arr[i][key] && arr[i][key] === value) {
                return index ? i : arr[i];
            }
        }
        return index ? -1 : null;
    }

    export function removeObjectFromArray(arr, key, value) {
        if(!arr || !key) return [];
        for (let i = 0, len = arr.length; i < len; i++) {
            if ((value !== undefined && arr[i][key] === value) || (value === undefined && arr[i] === key)) {
                return arr.splice(i, 1);
            }
        }

        return [];
    }

    export function merge(target, source) {
        const copyObj = {},
            copyFuns = {};

        for (const key in target) {
            if (!isFunction(target[key])) {
                copyObj[key] = target[key];
            } else {
                copyFuns[key] = target[key];
            }
        }
        /*eslint-disable */
        const newObj = mixin(JSON.parse(JSON.stringify(copyObj)), source);
    /*eslint-enable */
    for (const key in copyFuns) {
        newObj[key] = copyFuns[key];
    }

    return newObj;
}

export function unique(array) {
    const r = [];

    for (let i = 0, l = array.length; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
            if (array[i] === array[j]) j = ++i;
        }
        r.push(array[i]);
    }

    return r;
}

export function uniqueObjectArray(arr, key1, key2) {
    const result = [];
    const obj = {};
    for(let i =0, len = arr.length; i < len; i++) {
        const key = key2 ?　arr[i][key1][key2]:arr[i][key1];
        if(!obj[key]) {
            result.push(arr[i]);
            obj[key] = true;
        }
    }
    return result;
}

export function contain(arr, item) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === item) { return i; }
    }

    return -1;
}

export function removeFromArray(arr, item) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === item) { arr.splice(i,1); return; }
    }
}

export function throttle(fn, time, context) {
    let lock = null,
        args = null;

    function later() {
        lock = false;
        if (args) {
            wrapperFn.apply(context, args);
            args = false;
        }
    }

    function wrapperFn() {
        if (lock) {
            args = arguments;
        } else {
            fn.apply(context, arguments);
            setTimeout(later, time);
            lock = true;
        }
    }

    return wrapperFn;
}

export function distinct(arr) {
    if (isArray(arr)) {
        const len = arr.length;
        function loop(index) {
            if (index >= 1) {
                if (arr[index] === arr[index - 1]) {
                    arr.splice(index, 1);
                }
                loop(index - 1);
            }
        }
        loop(len - 1);
    }

    return arr;
}

// 交换数组顺序
export function swapArrItems(arr, oldIndex, newIndex) {
    /*eslint-disable */
    arr[oldIndex] = arr.splice(newIndex, 1, arr[oldIndex])[0];
    /*eslint-enable */
    return arr;
}

export function moveInArray(arr, oldIndex, newIndex){
    // index是当前元素下标，newIndex是拖动到的位置下标。
    //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
    //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
    if(oldIndex > newIndex){
      arr.splice(newIndex, 0, arr[oldIndex]);
      arr.splice(oldIndex + 1, 1);
    } else{
    //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
    //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
      arr.splice(newIndex + 1, 0, arr[oldIndex]);
      arr.splice(oldIndex, 1);
    }
  }


export function guid(isShort) {
    const s = (isShort ? 'yxxxxxxyxx' : 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return s.toLowerCase();
}

export function equalArray(a, b) {
    if(a.length !== b.length) return false;
    for(let i =0;i<a.length;i++) {
        if(a[i] !== b[i]) return false;
    }
    return true;
}

/**
 * 
 * @param {String} str 待替换的字符串
 * @param {String} oldStr 替换前的字符
 * @param {String} newStr 替换后的字符
 */
export function replaceAll(str, oldStr, newStr) {
    // JSON.parse(JSON.stringify({a:{b:'[1,1,3]'}, c:'[1,2]'}).replace(/\"\[/ig,"[").replace(/\]\"/ig,"]"))
    return str.replace(new RegExp(oldStr, 'gi'), newStr);
}

export function getQueryStr(str) {
    let LocString = String(window.document.location.href);
    let rs = new RegExp("(^|)" + str + "=([^\&]*)(\&|$)", "gi").exec(LocString),
      tmp;
    if (tmp = rs) {
      return tmp[2];
    }
    return '';
}

export function checkPhone(mobile) {
    var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/; 
    return phone.test(mobile);
}

// 转为unicode 编码
export function encodeUnicode(str) {
    var res = [];
    for ( var i=0; i<str.length; i++ ) {
	res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
    }
    return "\\u" + res.join("\\u");
}
 
// 解码
export function decodeUnicode(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}

/**
 * 验证是否为JSON
 */
export function isJsonString(str) {
    if (isString(str)) {
        try {
            const obj = JSON.parse(str);
            return typeof obj === 'object' && obj;
        } catch(e) {
            // console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    return false;
}

const GeoTypes = [
    // geometries
    'Point',
    'Polygon',
    'LineString',
    'MultiPoint',
    'MultiPolygon',
    'MultiLineString',
    'GeometryCollection',
    'Feature',
    'FeatureCollection']
    .reduce((memo, t) => {
        memo[t] = true;
        return memo;
}, {});

/**
 * 判断是否为GeoJSON对象
 * @param {String} str
 * @return {Boolean}
 */
export function isGeoJsonObject(obj) {
    if(!obj || !isObject(obj) || !obj.type || !GeoTypes[obj.type]) return false;
    return true;
}


export function camel2hyphens(str) {
    return str.replace(/([A-Z])/g,"-$1").toLowerCase();
}

export function hyphens2camel(str) {
    // return str.replace(//-(/w)/g, function(x){return x.slice(1).toUpperCase();});
    let a = str.split("-");
    let o = a[0];
    for(var i=1;i<a.length;i++){
        o = o + a[i].slice(0,1).toUpperCase() + a[i].slice(1);
    }
    return o;
}

export function sort({key, order}) {
    return (a, b) => {
        const ak = key ? a[key]: a;
        const bk = key ? b[key]: b;
        if(dayjs(ak).isValid()) { // 时间
            return order === 'desc' ? 
                (new Date(bk).getTime() - new Date(ak).getTime()):
                (new Date(ak).getTime() - new Date(bk).getTime());
                // (dayjs(bk).unix() - dayjs(ak).unix()):
                // (dayjs(ak).unix() - dayjs(bk).unix());
        } else if(isValidNumber(ak)) { // 数字
            return order === 'desc' ? (bk - ak) : (bk - ak);
        } else { // 字符
            return order === 'desc' ? 
            bk.toLocaleLowerCase().localeCompare(ak.toLocaleLowerCase(), 'zh-CN'):
            ak.toLocaleLowerCase().localeCompare(bk.toLocaleLowerCase(), 'zh-CN');
        }
    }
}

export function getFilenameSuffix(filename) {
  return /\.[^\.]+$/.exec(filename); 
}

function _getRandomColorNumber() {
    const n = Math.round(Math.random() * 255);
    return n > 255 ? 255 : n;
}

export function randomColor() {
    const r = _getRandomColorNumber();
    const g = _getRandomColorNumber();
    const b= _getRandomColorNumber();
    return `rgb(${r}, ${g}, ${b})`;
}

export function getTimescore(type) {
    const now = new Date();
    if(type === 'date') return dayjs(now).format('YYYYMMDD');
    if(type === 'hour') return dayjs(now).format('YYYYMMDDhh');
    if(type === 'minitue') return dayjs(now).format('YYYYMMDDhhmm');
    return dayjs(now).format('YYYYMMDDhhmmss');
}