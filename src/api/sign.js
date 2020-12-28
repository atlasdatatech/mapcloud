import {ajax_get, ajax_post} from '../utils/ajax';
import {setRouter, ROUTES} from '../utils/router';
import Local from '../utils/local';

export function isAccountOnline(callback) {
  const name = Local.get('name');
  const token = Local.get('token');
  if(name && token) {
    ajax_get({url: 'account/'}).then((res) => {
        if(res && res.code === 200 && res.data) {
          callback && callback(true);
        } else {
          callback && callback(false);
        }
      }).catch((err) => {
          callback && callback(false);
      })
  } else {
      callback && callback(false);
  }
}

export function login({name, password, error, success}) {
    Local.clear();
    ajax_post('sign/in/', {name, password}).then((data) => {
        let nameMsg = '', passwordMsg = '';
        if(data.code === 4011) {
          nameMsg = '用户名或密码错误';
          passwordMsg = '用户名或密码错误';
        } 
        if(data.code === 4012) {
          nameMsg = '用户名或密码非法';
          passwordMsg = '用户名或密码非法';
        } 
        if(data.code === 4013) {
          nameMsg = '用户已存在';
        } 
        if(data.code === 4041) {
            nameMsg = '用户不存在';
        }
        if(nameMsg || passwordMsg) {
            error && error({nameMsg, passwordMsg});
        }else if (data.code === 200 && data.data) {
          Local.set('name', data.data.name);
          Local.set('token', data.data.jwt);
          setRouter(ROUTES.MAP_LIST);
        }
      });
}