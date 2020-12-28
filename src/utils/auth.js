import {contain, isString, isArray} from './util';
import {ajax_get} from './ajax';
import router from 'umi/router';

export const SUPER_ROLES = ['super_group', 'admin_group'];

export function getRole() {
    const role = Cookie.get('role');
    return role ? JSON.parse(role) : [];
}

export function isSuperUser(role) {
    role = role || getRole();
    role = isString(role) ? [role] : role;
    let isSuper = false;
    role.forEach((r) => {
        if(contain(SUPER_ROLES, r) >= 0) {
            isSuper = true;
            return;
        }
    });
    return isSuper;
}

export function getUser() {
    return {
        user: Cookie.get('user') || '未登陆用户',
        token: Cookie.get('token'),
        role: Cookie.get('role'),
        expire: Cookie.get('expire')
    }
}

export function checkLogin() {
    const user = Cookie.get('user');
    const token = Cookie.get('token');
    const role = Cookie.get('role');
    const expire = Cookie.get('expire');

    if(!user || !token) {
        router.push('/logout');
    } else {
        ajax_get({url: 'account/'}).then((res) => {
            if(res && res.code === 200 && res.data) {

            } else {
                router.push('/');
            }
        }).catch((err) => {
            router.push('/');
        })
    }
}

export function checkAdmin(redirect) {
    if(!isSuperUser()) {
        if(redirect) {
            router.push('/map/list');
        }
        return false;
    } else {
        return true;
    }
}

