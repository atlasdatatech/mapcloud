// import fetch from 'dva/fetch';
import config, { setConfig } from './config';
import { isAccountOnline } from './api/sign';
import Local from './utils/local';
import PL from 'popoload';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

// let authRoutes = {};

// function ergodicRoutes(routes, authKey, authority) {
//   routes.forEach(element => {
//     if (element.path === authKey) {
//       if (!element.authority) element.authority = []; // eslint-disable-line
//       Object.assign(element.authority, authority || []);
//     } else if (element.routes) {
//       ergodicRoutes(element.routes, authKey, authority);
//     }
//     return element;
//   });
// }

// export function patchRoutes(routes) {
//   Object.keys(authRoutes).map(authKey =>
//     ergodicRoutes(routes, authKey, authRoutes[authKey].authority)
//   );
//   window.g_routes = routes;
// }

function toLogin() {
  location.href = "./login.html";
}

export function render(oldRender) {
    const timesorce = new Date().getTime();
      PL({
          config:{path:{root:'./'}}, 
          libs:['root:config/config.js?' + timesorce], 
          loaded:() => {
            const host = (window.ATCONFIG && window.ATCONFIG.host) || DEV_HOST || (location.origin + '/');
            setConfig({
              host: host ,
            });
            isAccountOnline((isOnLine) => {
              if(!isOnLine) {
                Local.clear();
                toLogin();
              }
              // if(window.PAGE_SPINNER) {
              //   window.PAGE_SPINNER.spin();
              //  }
               oldRender();
            });
          }
      });
}