;(function() {
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?ceea4187d8f78ff5a527df9d3d90a499";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
    // 初始化地图
    function initMap(map) {
        if(!map) return;
        var inspectorPopup =  new atlas.Popup({className:'atlas-popup-a'});
        map.on('mousemove', function(e) {
            var bbox = {width: 10, height: 10};
            var feature = map.queryRenderedFeatures([
                [e.point.x - bbox.width / 2, e.point.y - bbox.height / 2],
                [e.point.x + bbox.width / 2, e.point.y + bbox.height / 2]
            ])[0];
            if(feature) {
                map.setCursor('pointer');
            } else {
                map.setCursor();
            }
        });
        map.on('click', function(e){
            var bbox = {width: 10, height: 10};
            var feature = map.queryRenderedFeatures([
                [e.point.x - bbox.width / 2, e.point.y - bbox.height / 2],
                [e.point.x + bbox.width / 2, e.point.y + bbox.height / 2]
            ])[0];
            if(feature && feature.properties) {
                var properties = feature.properties;
                var html = '<div class="at-inspect-popup"><table><tbody>';
                for(var key in properties) {
                    html += `<tr><td>${key}</td><td>${properties[key] || ''}</td></tr>`;
                }
                html += '</tbody></table></div>';
                inspectorPopup.setLngLat(e.lngLat).setHTML(html).addTo(map);
            } else {
                inspectorPopup.remove();
                
            }
        })
    }


    if(window.PL) {
        var config = {path: {root:'./'}};
        var params = location.search.slice(1);
        window.LOCATION_PARAMS = {};
        if (params) {
            params.split("&").forEach(function (param) {
            var t = param.split("=");
            LOCATION_PARAMS[t[0]] = decodeURI(t[1]);
            });
        }
        var showTitle = LOCATION_PARAMS.title === "true" || LOCATION_PARAMS.title === undefined ? true : false;
        var timescore = new Date().getTime();
        PL({
            config: config,
            libs: [
                'root:libs/jquery.min.js',
            ],
            styles: [
                'root:css/common.css?' + timescore,
            ],
            loaded: function() {
                if(showTitle) {
                    $("#nav").fadeIn();
                }
                var start = 0, intervalId = 0;
                intervalId = setInterval(function() {
                    $("#timeTotal").text((start++) + '秒');
                }, 1000);
                PL({
                    config: config,
                    libs: [
                        'root:config/config.js?' + timescore,
                        'root:libs/jquery.min.js',
                        'root:libs/atlas/atlas.min.js?' + timescore,
                    ],
                    styles: [
                        'root:libs/atlas/atlas.min.css?' + timescore,
                        'root:css/animate.min.css?' + timescore,
                        'root:css/pills.min.css?' + timescore,
                    ],
                    loaded: function() {
                        var accessToken = LOCATION_PARAMS.access_token;
                        var id = LOCATION_PARAMS.id;
                        const ATCONFIG = window.ATCONFIG;
                        if(!id || !accessToken) {
                            clearInterval(intervalId);
                            $("#nav .link").fadeIn();
                            $("#nav p").remove();
                            $("#nav h1").text("缺少参数，无法浏览地图 :(").css({textAlign:'center', marginBottom: '10px'}).fadeIn(); 
                            return;
                        }
                        var host = ATCONFIG.host || 'http://api.atlasdata.cn/';
                        // if(host.lastIndexOf('/') === (host.length - 1)) {
                        //     host = host.substring(0, host.length - 1);
                        // }
                        $.get(host + 'maps/info/' + id+ '/?access_token=' + accessToken, function(res) {
                            if(res && res.code === 200 && res.data) {
                                $("#nav h1").text(res.data.name);
                                atlas.setConfig({
                                    accessToken: accessToken,
                                    apiUrl: host
                                });
                                const map = new atlas.Map({
                                    container: 'map',
                                    style: 'atlasdata://maps/x/'+ id + '/'
                                });
            
                                map.addControl(new atlas.NavigationControl(),"top-right");
            
                                clearInterval(intervalId);
                                if(showTitle) {
                                    $("#nav").animate({
                                        left: '20px', 
                                        top: '20px', 
                                    }, 'slow');
                                    $("#nav .logo").removeClass("animated infinite bounce delay-2s").css({
                                        height: '50px',
                                    });
                                    $("#nav").addClass("nav-top");
                                    $("#nav h1").fadeIn();
                                    $("#nav p").remove();
                                }
                                map.on("load", function() {
                                    initMap(map);
                                });
            
                            } else {
                                clearInterval(intervalId);
                                if(showTitle) {
                                    $("#nav .link").fadeIn();
                                    $("#nav p").remove();
                                    $("#nav h1").text("地图读取错误，可能被删除了 :(").css({textAlign:'center', marginBottom: '10px'}).fadeIn();
                                }
                            }
                        })
                    }
                })
            }
        })
        
    }
}());
