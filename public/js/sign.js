if(window.PL) {
    var _hmt = _hmt || [];
    // (function() {
    //   var hm = document.createElement("script");
    //   hm.src = "https://hm.baidu.com/hm.js?ceea4187d8f78ff5a527df9d3d90a499";
    //   var s = document.getElementsByTagName("script")[0]; 
    //   s.parentNode.insertBefore(hm, s);
    // })();
    var config = {path: {root:'./'}};
    var SIGNTYPE = window.SIGNTYPE || 'login';
    function toCenter() {
        location.href = './#/map/list';
    }
    var params = location.search.slice(1).toLowerCase();
    window.LOCATION_PARAMS = {};
    if (params) {
        params.split("&").forEach(function (param) {
        var t = param.split("=");
        LOCATION_PARAMS[t[0]] = decodeURI(t[1]);
        });
    }
    var timescore = new Date().getTime();
    PL({
        config: config,
        libs: [
            'root:config/config.js?' + timescore,
            'root:libs/jquery.min.js',
            'root:libs/axios.min.js',
        ],
        loaded: function() {
            var token = localStorage.getItem('token');
            if(token && (SIGNTYPE === 'login' 
                || SIGNTYPE === 'applypw' 
                || SIGNTYPE === 'register' 
                || SIGNTYPE === 'resetpw')) {
                $.ajax({
                    url: ATCONFIG.host + "account/",
                    xhrFields: {
                        withCredentials: true
                    },
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                    type: 'GET',
                    success: function(data) {
                        if(data && data.code === 200) {
                            toCenter();
                        }
                    }
                });
            }
            PL({
                config: config,
                libs: [
                    'root:libs/jquery.validate.min.js',
                    'root:libs/jquery.cookie.min.js',
                    'root:js/' + SIGNTYPE + '.js?' + timescore
                ],
                styles: [
                    'root:css/pills.min.css',
                    'root:css/common.css?' + timescore
                ],
                loaded: function() {
                    $(".main").slideDown();
                    // setTimeout(function() {
                    //     $("#account").focus();
                    // }, 500);
                }
            })
        }
    })
}
