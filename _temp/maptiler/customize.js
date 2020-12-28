!function(e) {
    var t = {};
    function n(o) {
        if (t[o])
            return t[o].exports;
        var a = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(a.exports, a, a.exports, n),
        a.l = !0,
        a.exports
    }
    n.m = e,
    n.c = t,
    n.d = function(e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }
    ,
    n.r = function(e) {
        "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(e, t) {
        if (1 & t && (e = n(e)),
        8 & t)
            return e;
        if (4 & t && "object" === typeof e && e && e.__esModule)
            return e;
        var o = Object.create(null);
        if (n.r(o),
        Object.defineProperty(o, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" !== typeof e)
            for (var a in e)
                n.d(o, a, function(t) {
                    return e[t]
                }
                .bind(null, a));
        return o
    }
    ,
    n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(t, "a", t),
        t
    }
    ,
    n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    n.p = "",
    n(n.s = 4)
}([function(e, t) {
    var n;
    n = function() {
        return this
    }();
    try {
        n = n || new Function("return this")()
    } catch (e) {
        "object" === typeof window && (n = window)
    }
    e.exports = n
}
, , , , function(e, t, n) {
    n(5),
    e.exports = n(6)
}
, function(e, t, n) {
    (function(e) {
        var t, n, o, a, l, i, r, c, u, s, d = !0;
        function f() {
            var e = document.getElementById("font")
              , t = document.getElementById("font-style")
              , n = (e.options[e.selectedIndex].getAttribute("data-styles") || "").split(",")
              , o = ""
              , a = n.indexOf("Regular") >= 0 && n.indexOf("Bold") >= 0 && n.indexOf("Italic") >= 0;
            a && (o += '<option value="" selected>---</option>'),
            n.forEach(function(e) {
                o += '<option value="' + e + '"' + (a || "Regular" != e ? "" : " selected") + ">" + e + "</option>"
            }),
            t.innerHTML = o,
            e.value.length && 0 != e.value.indexOf("Noto ") ? document.getElementById("font-fallback-wrap").style.display = "" : (document.getElementById("font-fallback-wrap").style.display = "none",
            document.getElementById("font-fallback").value = "")
        }
        function m() {
            if (u)
                return;
            var e = n.getCenter()
              , t = Math.round(100 * n.getZoom()) / 100
              , o = Math.ceil((t * Math.LN2 + Math.log(512 / 360 / .5)) / Math.LN10)
              , a = Math.pow(10, o)
              , l = Math.round(e.lng * a) / a
              , i = Math.round(e.lat * a) / a
              , r = n.getBearing()
              , c = n.getPitch();
            let s = [mapUid, t, i, l].join("/");
            (r || c) && (s += "/" + Math.round(10 * r) / 10),
            c && (s += "/" + Math.round(c)),
            location.hash = s
        }
        function g(e, c, s, f, g, v, h, b) {
            var k;
            mapUid = c,
            o = s,
            l = h || l,
            document.getElementById("selected-map-title").innerHTML = e,
            i = document.getElementById("save-btn");
            var I = [fetch(g, {
                credentials: "same-origin"
            }).then(function(e) {
                return e.json()
            }).then(function(e) {
                t = e
            }), fetch(v, {
                credentials: "same-origin"
            }).then(function(e) {
                return e.json()
            }).then(function(e) {
                a = e
            })];
            u && r && I.push(fetch(r, {
                credentials: "same-origin"
            }).then(function(e) {
                return e.json()
            }).then(function(e) {
                k = e,
                r = null
            })),
            Promise.all(I).then(function() {
                var e;
                if (a.groups && a.groups.length) {
                    e = {
                        id: "original",
                        name: "Original",
                        preset: {
                            groups: {}
                        },
                        thumbnail: f
                    };
                    var o = document.getElementById("colors")
                      , i = "";
                    a.groups.forEach(function(n, o) {
                        var a = n.id;
                        if (i += '<div class="editor-list-item"' + (0 == o ? ' id="editor-list-item-first" ' : "") + ">",
                        !1 !== n.color) {
                            var l = p(t.layers.find(function(e) {
                                return e.id == n.layers[0]
                            })).toHexString();
                            i += '<input type="color" id="g-' + a + '-color" onchange="editor_update();" value="' + l + '">'
                        }
                        i += '<h4 id="g-' + a + '-title" class="editor-list-item-title" >',
                        i += n.name,
                        !1 !== n.color && (i += '<input class="editor-item-reset" type="button" title="Reset default color" onclick="set_color_value(\'g-' + a + "-color','" + l + '\');editor_update();" value="0">'),
                        i += "</h4>",
                        i += '<div style="display:inline-block"' + (0 == o ? ' id="editor-list-item-buttons-first" ' : "") + ">",
                        i += '<span class="editor-item-display" title="Dislay layer"><input type="checkbox" id="g-' + a + '-on" onchange="editor_update();" checked="checked"><label for="g-' + a + '-on">e</label></span>',
                        !1 !== n.color && (i += '<span class="editor-item-force" title="Force the selected color tone to all layers in this group"><input id="g-' + a + '-force-color" type="checkbox" onchange="editor_update();"><label for="g-' + a + '-force-color">9</label></span>',
                        n.invertableText && (i += '<span class="editor-item-invert" title="Invert text color"><input type="checkbox" id="g-' + a + '-invert-text" onchange="editor_update();"><label for="g-' + a + '-invert-text" class="inline">&#x7f;</label>')),
                        i += "</div>",
                        i += "</div>",
                        e.preset.groups[a] = {
                            show: !0,
                            color: l,
                            forceColor: !1,
                            invertText: !1
                        }
                    }),
                    o.innerHTML = i,
                    $.fn.spectrum.processNativeColorInputs()
                } else
                    document.getElementById("btn-1").style.display = "none",
                    document.getElementById("tab-1").style.display = "none",
                    document.getElementById("btn-2").classList.add("active"),
                    document.getElementById("tab-2").classList.add("active");
                if (document.getElementById("lang").value = "",
                document.getElementById("lang-alternative").checked = !0,
                document.getElementById("font").value = "",
                document.getElementById("font-style").value = "",
                document.getElementById("font-fallback-wrap").value = "",
                e && (a.presets = a.presets || [],
                a.presets.unshift(e)),
                a.presets && a.presets.length) {
                    var r = document.getElementById("presets")
                      , u = (i = "",
                    1);
                    a.presets.forEach(function(e) {
                        var t = (e.preset || {}).groups || {}
                          , n = encodeURIComponent((t.water || {}).color || "")
                          , o = encodeURIComponent((t.landscape || {}).color || "")
                          , r = '<img src="' + (e.thumbnail || l + "?water=" + n + "&land=" + o) + '" />';
                        i += '<div class="preset-thumb" onclick="editor_preset(\'' + e.id + "');event.stopPropagation()\" title='Load \"" + e.name + "\" preset'>" + r + "</div>",
                        1 == u && a.presets.length > 1 && (i += "<h5>Presets</h5>"),
                        u++
                    }),
                    r.innerHTML = i
                }
                if (y(k),
                d = !k || 0 == Object.keys(k).length,
                0 === c.indexOf("uk-openzoomstack")) {
                    var s = [-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085]
                      , g = n.getCenter();
                    (g.lng < s[0] || g.lng > s[2] || g.lat < s[1] || g.lat > s[3]) && n.fitBounds(s, {
                        duration: 0
                    })
                }
                x(!d),
                m(),
                k = null,
                b || E(!1)
            })
        }
        var v, y = function(e) {
            e && (Object.keys(e.groups || {}).forEach(function(t) {
                var n, o = e.groups[t];
                o.color && (I("g-" + t + "-color", o.color),
                (n = document.getElementById("g-" + t + "-invert-text")) && (n.checked = o.invertText),
                (n = document.getElementById("g-" + t + "-force-color")) && (n.checked = !!o.forceColor));
                void 0 !== o.show && ((n = document.getElementById("g-" + t + "-on")) && (n.checked = o.show))
            }),
            e.language && (void 0 !== e.language.code && (document.getElementById("lang").value = e.language.code),
            void 0 !== e.language.alternatives && (document.getElementById("lang-alternative").checked = e.language.alternatives)),
            void 0 !== e.font && (document.getElementById("font").value = e.font,
            f(),
            document.getElementById("font-style").value = e.fontStyle || "",
            document.getElementById("font-fallback").value = e.fontFallback || ""),
            void 0 !== e.remove3d && (document.getElementById("remove-3d").checked = e.remove3d),
            (e.center || e.zoom) && n.jumpTo({
                center: e.center,
                zoom: +e.zoom
            }))
        }, p = function(e) {
            var t = "#ffffff";
            return e && e.paint && (t = e.paint["background-color"] || e.paint["fill-color"] || e.paint["fill-outline-color"] || e.paint["line-color"] || e.paint["icon-color"] || e.paint["icon-halo-color"] || e.paint["text-color"] || e.paint["text-halo-color"] || e.paint["circle-color"] || e.paint["circle-stroke-color"] || e.paint["fill-extrusion-color"]) && t.stops && (t = t.stops[0][1]),
            tinycolor(t)
        }, h = function(e) {
            return (e % 360 + 360) % 360
        }, b = function(e, t, n) {
            var o = function(e) {
                if ((e = tinycolor(e).toHsl()).l < 1e-4 && (e.l = 1e-4),
                t.forceColor)
                    e.h = t.hNew;
                else {
                    var o = Math.min(1, Math.abs(t.hOld - e.h) / 360 / e.l);
                    e.h = (a = o,
                    l = t.hOld,
                    i = e.h,
                    h(a * (h(l) + 360) + (1 - a) * (h(i) + 360))),
                    e.h = h(e.h + t.h)
                }
                var a, l, i;
                return e.s = Math.max(0, Math.min(1, e.s + t.s)),
                e.l = Math.max(0, Math.min(1, e.l + t.l)),
                t.invertText && 0 === n.indexOf("text-") && (e.l = 1 - e.l),
                tinycolor(e).toRgbString()
            };
            if (e)
                return e.stops ? {
                    stops: e.stops.map(function(e) {
                        return [e[0], o(e[1])]
                    })
                } : o(e)
        };
        function x(e) {
            v = {
                groups: {},
                language: {}
            };
            var o = n.getCenter();
            v.center = [o.lng, o.lat],
            v.zoom = n.getZoom();
            var l = JSON.parse(JSON.stringify(t));
            (a.groups || []).forEach(function(e) {
                var n, o, a, i, r = e.id, c = !!document.getElementById("g-" + r + "-on").checked;
                if (!1 !== e.color) {
                    a = e.invertableText && document.getElementById("g-" + r + "-invert-text").checked,
                    i = !!document.getElementById("g-" + r + "-force-color").checked;
                    var u = tinycolor(p(t.layers.find(function(t) {
                        return t.id == e.layers[0]
                    })).setAlpha(1)).toHsl();
                    n = document.getElementById("g-" + r + "-color").value;
                    var s = tinycolor(n).toHsl();
                    !(o = {
                        forceColor: i,
                        invertText: a,
                        hOld: u.h,
                        hNew: s.h,
                        h: s.h - u.h,
                        s: s.s - u.s,
                        l: s.l - u.l
                    }).invertText && !o.forceColor && Math.max(Math.abs(o.h / 360), Math.abs(o.s), Math.abs(o.l)) < .01 && (o = null)
                }
                var d = p(t.layers.find(function(t) {
                    return t.id == e.layers[0]
                })).toHexString() != n;
                v.groups[e.id] = {
                    forceColor: i,
                    invertText: a,
                    color: d ? n : void 0,
                    show: c
                };
                var f = document.getElementById("g-" + r + "-title");
                c ? f.classList.remove("unused") : f.classList.add("unused"),
                e.layers.forEach(function(e) {
                    var t = l.layers.find(function(t) {
                        return t.id == e
                    });
                    if (t)
                        if (c) {
                            if (o) {
                                var n = t.paint || {};
                                Object.keys(n).forEach(function(e) {
                                    e.endsWith("-color") && (n[e] = b(n[e], o, e))
                                })
                            }
                        } else
                            t.layout || (t.layout = {}),
                            t.layout.visibility = "none"
                })
            });
            var r = document.getElementById("lang").value
              , c = document.getElementById("lang-alternative").checked;
            r && (v.language.code = r,
            v.language.alternatives = c,
            function(e, t, n) {
                for (var o = ["ar", "hy", "be", "bg", "zh", "ka", "el", "he", "ja", "ja_kana", "kn", "kk", "ko", "mk", "ru", "sr", "th", "uk"].indexOf(t) >= 0, a = "{name:" + t + "}" + (n ? "\n{name:" + (o ? "latin" : "nonlatin") + "}" : ""), l = "{name:latin}" + (n ? "\n{name:nonlatin}" : ""), i = e.layers.length - 1; i >= 0; i--) {
                    var r = e.layers[i]
                      , c = r.layout && r.layout["text-field"];
                    if (c && c.stops && (c = c.stops[0][1]),
                    c && 0 === c.indexOf("{name"))
                        if ("native" == t)
                            r.layout["text-field"] = "{name}";
                        else {
                            var u = JSON.parse(JSON.stringify(r));
                            u.id += "-" + t,
                            e.layers.splice(i + 1, 0, u),
                            "line" === r.layout["symbol-placement"] ? (u.layout["text-field"] = a.replace("\n", " "),
                            r.layout["text-field"] = l.replace("\n", " ")) : (u.layout["text-field"] = a,
                            r.layout["text-field"] = l);
                            var s = ["has", "name:" + t]
                              , d = ["!has", "name:" + t];
                            r.filter ? "all" == r.filter[0] ? (u.filter.push(s),
                            r.filter.push(d)) : (u.filter = ["all", u.filter, s],
                            r.filter = ["all", r.filter, d]) : (u.filter = s,
                            r.filter = d)
                        }
                }
            }(l, r, c));
            var u = document.getElementById("font").value;
            if (u) {
                var s = document.getElementById("font-style").value || void 0
                  , d = document.getElementById("font-fallback").value || void 0;
                v.font = u,
                v.fontStyle = s,
                v.fontFallback = d,
                function(e, t, n, o) {
                    e.layers.forEach(function(e) {
                        if ("symbol" == e.type) {
                            var a = (e.layout || {})["text-font"];
                            if (a && a.length) {
                                var l = a[0]
                                  , i = "Regular";
                                l.indexOf(" Bold") > 0 ? i = "Bold" : l.indexOf(" Italic") > 0 && (i = "Italic"),
                                n || (n = i),
                                e.layout["text-font"] = [t + " " + n],
                                o && e.layout["text-font"].push(o + " " + i)
                            }
                        }
                    })
                }(l, u, s, d)
            }
            return document.getElementById("font-style").style.display = u ? "" : "none",
            !!document.getElementById("remove-3d").checked && (v.remove3d = !0,
            l.layers.forEach(function(e) {
                if ("fill-extrusion" == e.type) {
                    e.type = "fill";
                    var t = e.paint || {};
                    e.paint = {},
                    ["color", "opacity", "translate", "translate-anchor"].forEach(function(n) {
                        var o = "fill-extrusion-" + n;
                        if (void 0 !== t[o]) {
                            var a = "fill-" + n;
                            e.paint[a] = t[o]
                        }
                    })
                }
            })),
            n.setStyle(l),
            e || (i.disabled = !1,
            window.onbeforeunload = function() {
                return "Your changes will be lost. Continue?"
            }
            ),
            v
        }
        function E(e) {
            document.body.classList.toggle("collapse-sidebar-map", !e)
        }
        function k() {
            params = x(),
            i.disabled = !0,
            window.onbeforeunload = void 0;
            var e = fetch(c, {
                method: u ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    template_uuid: o,
                    template_arguments: params
                })
            });
            return u ? e : e.then(function(e) {
                return e.json()
            }).then(function(e) {
                window.location = e.html_url
            })
        }
        function I(e, t) {
            var n = document.getElementById(e);
            n && (n.value = t,
            $("#" + e).spectrum("set", t))
        }
        e.editor_advanced = function() {
            s ? kt.confirm("If you use the advanced editor, you will NOT be able to use the customize tool for this map any longer.", function(e) {
                e && (i.disabled ? window.location = s : k().then(function() {
                    window.location = s
                }))
            }, "Convert map?") : kt.alert("You need to save the map first before using the advanced editor.")
        }
        ,
        e.editor_create_font_options = function(e) {
            var t = document.getElementById("font")
              , n = ["Regular", "Bold", "Italic", "Black", "Light", "Thin", "Semi", "Extra", "Semibold", "Medium"]
              , o = {};
            e.forEach(function(e) {
                for (var t, a = e.split(" "), l = []; t = a.pop(); ) {
                    if (!(n.indexOf(t) >= 0)) {
                        a.push(t);
                        break
                    }
                    l.unshift(t)
                }
                l = l.join(" ");
                var i = a.join(" ");
                o[i] = o[i] || {},
                o[i][l] = !0
            });
            var a = '<option value="">Style default</option>';
            Object.keys(o).forEach(function(e) {
                a += '<option value="' + e + '" data-styles="' + Object.keys(o[e]).join(",") + '">' + e + "</option>"
            }),
            t.innerHTML = a,
            f()
        }
        ,
        e.editor_save = k,
        e.editor_set_basemap = function(e, t, n, o, a, l, i, r) {
            d ? g(e, t, n, o, a, l, i, r) : kt.confirm("Changing the map will overwrite the current state. Continue?", function(c) {
                c && g(e, t, n, o, a, l, i, r)
            })
        }
        ,
        e.editor_start = function(e, t, o) {
            if (c = e,
            s = o,
            (u = !!t) && (r = c),
            mapboxgl.setRTLTextPlugin("https://cdn.klokantech.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.2/mapbox-gl-rtl-text.js"),
            (n = new mapboxgl.Map({
                container: "map"
            })).addControl(new mapboxgl.NavigationControl(), "top-right"),
            !u) {
                const e = window.location.hash.replace("#", "").split("/");
                e.splice(1),
                e.length >= 3 && n.jumpTo({
                    center: [+e[2], +e[1]],
                    zoom: +e[0],
                    bearing: +(e[3] || 0),
                    pitch: +(e[4] || 0)
                }),
                n.on("moveend", m)
            }
        }
        ,
        e.editor_update = x,
        e.editor_update_font_styles = f,
        e.open_map_sidebar = E,
        e.set_color_value = I
    }
    ).call(this, n(0))
}
, function(e, t, n) {}
]);
