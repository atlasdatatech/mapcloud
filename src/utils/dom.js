import {contain} from './util';

export function setBodyHeight(val) {
    val = val || 'auto';
    const root = document.getElementById('root');
    const body = document.body;
    const html = document.body.parentElement;
    if(html && body) {
        html.style.height = val;
        body.style.height = val;
        body.style.overflow = val === '100%' ? 'hidden' : '';
    }
    if(root) {
        root.style.height = val;
    }
}

function checkRoute(routes, location) {
    let flag = false;
    routes.forEach((route) => {
        if(location.indexOf(route) >=0) {
            flag = true;
        }
    });
    return flag;
}


export function isFullHeightBody(location) {
    const routes = ['/map/edit', '/dataset/edit', '/map/view', '/ts/view'];
    return checkRoute(routes, location);
}

export function isHalfFullHeightBody(location) {
    const routes = ['/dataset/detail', '/ts/detail'];
    return checkRoute(routes, location);
}

export function hasClass(obj, cls){
    var obj_class = obj.className,//获取 class 内容.
    obj_class_lst = obj_class.split(/\s+/),//通过split空字符将cls转换成数组.
    x = 0;
    for(x in obj_class_lst) {
        if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
        return true;
        }
    }
    return false;
}

export function addClass(obj, cls){
    if(hasClass(obj, cls)) return;
    const obj_class = obj.className,//获取 class 内容.
    blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    const added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
    obj.className = added;//替换原来的 class.
}
     
export function removeClass(obj, cls){
    if(!hasClass(obj, cls)) return;
    let obj_class = ' ' + obj.className +' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' ');//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
    let removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
}

function _removeNodeClass(treeClassName, hoverClassName) {
    if(!treeClassName) return;
    let eles = document.querySelectorAll(`.${treeClassName} .${hoverClassName}`);
    for(let i = 0; i < eles.length; i++) {
        if(eles[i]) {
            removeClass(eles[i], hoverClassName);
        }
    }
}
    
export function removeTreeHoverClass(treeClassName) {
    if(!treeClassName) return;
    _removeNodeClass(treeClassName, 'after');
    _removeNodeClass(treeClassName, 'before');
    _removeNodeClass(treeClassName, 'inner');
}
