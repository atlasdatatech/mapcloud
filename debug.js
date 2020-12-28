{
    "version": 8,
    "name": "标准地图",
    "metadata": {
      "hideBasemapLayer": false
    },
    "center": [
      106.5054286,
      29.5941081
    ],
    "zoom": 10.6,
    "bearing": 0,
    "pitch": 0,
    "sources": {
      "CW5_Cpqmg": {
        "type": "vector",
        "url": "atlasdata://ts/x/CW5_Cpqmg/"
      },
      "basic": {
        "type": "vector",
        "url": "atlasdata://ts/x/china/"
      },
      "atlas-basemap-tianditu-3": {
        "type": "raster",
        "tiles": [
          "http://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=9b3fdce6018190be9485d82d1da15758"
        ],
        "tileSize": 256
      },
      "atlas-basemap-tianditu-4": {
        "type": "raster",
        "tiles": [
          "http://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=9b3fdce6018190be9485d82d1da15758"
        ],
        "tileSize": 256
      },
      "atlas-basemap-tianditu-2": {
        "type": "raster",
        "tiles": [
          "http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=9b3fdce6018190be9485d82d1da15758"
        ],
        "tileSize": 256
      },
      "atlas-basemap-tianditu-1": {
        "type": "raster",
        "tiles": [
          "http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=9b3fdce6018190be9485d82d1da15758"
        ],
        "tileSize": 256
      },
      "atlas-base-map-google-2": {
        "type": "raster",
        "tiles": [
          "http://mt0.google.cn/vt/lyrs=s&x={x}&y={y}&z={z}"
        ],
        "tileSize": 256
      },
      "flvQUDzWg": {
        "type": "vector",
        "url": "atlasdata://ts/x/flvQUDzWg/"
      }
    },
    "sprite": "atlasdata://maps/x/qaT5R1RZR/sprite",
    "glyphs": "atlasdata://fonts/{fontstack}/{range}.pbf",
    "layers": [
      {
        "id": "background",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "background",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "background-color": "rgba(240, 240, 240, 1)"
        },
        "type": "background"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Polygon"
          ],
          [
            "==",
            "class",
            "residential"
          ]
        ],
        "id": "landuse-residential",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "landuse-residential",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "hsl(47, 13%, 86%)",
          "fill-opacity": 0.7
        },
        "source": "basic",
        "source-layer": "landuse",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "class",
            "grass"
          ]
        ],
        "id": "landcover_grass",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "landcover_grass",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "hsl(82, 46%, 72%)",
          "fill-opacity": 0.45
        },
        "source": "basic",
        "source-layer": "landcover",
        "type": "fill"
      },
      {
        "filter": [
          "all"
        ],
        "id": "park",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "park",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "rgba(192, 216, 151, 0.53)",
          "fill-opacity": 1
        },
        "source": "basic",
        "source-layer": "park",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "class",
            "wood"
          ]
        ],
        "id": "landcover_wood",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "landcover_wood",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "hsl(82, 46%, 72%)",
          "fill-opacity": {
            "base": 1,
            "stops": [
              [
                8,
                0.6
              ],
              [
                22,
                1
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "landcover",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Polygon"
          ]
        ],
        "id": "water",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "water",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "rgba(138, 197, 213, 1)"
        },
        "source": "basic",
        "source-layer": "water",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "subclass",
            "ice_shelf"
          ]
        ],
        "id": "landcover-ice-shelf",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "landcover-ice-shelf",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "hsl(47, 26%, 88%)",
          "fill-opacity": 0.8
        },
        "source": "basic",
        "source-layer": "landcover",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "subclass",
            "glacier"
          ]
        ],
        "id": "landcover-glacier",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "landcover-glacier",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "hsl(47, 22%, 94%)",
          "fill-opacity": {
            "base": 1,
            "stops": [
              [
                0,
                1
              ],
              [
                8,
                0.5
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "landcover",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "in",
            "class",
            "sand"
          ]
        ],
        "id": "landcover_sand",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-antialias": false,
          "fill-color": "rgba(232, 214, 38, 1)",
          "fill-opacity": 0.3
        },
        "source": "basic",
        "source-layer": "landcover",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "class",
            "agriculture"
          ]
        ],
        "id": "landuse",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "landuse",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "#eae0d0"
        },
        "source": "basic",
        "source-layer": "landuse",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "class",
            "national_park"
          ]
        ],
        "id": "landuse_overlay_national_park",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "landuse_overlay_national_park",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "#E1EBB0",
          "fill-opacity": {
            "base": 1,
            "stops": [
              [
                5,
                0
              ],
              [
                9,
                0.75
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "landcover",
        "type": "fill"
      },
      {
        "filter": [
          "all"
        ],
        "id": "park_outline",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "park_outline",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "rgba(159, 183, 118, 0.69)",
          "line-dasharray": [
            0.5,
            1
          ]
        },
        "source": "basic",
        "source-layer": "park",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "tunnel"
          ]
        ],
        "id": "waterway-tunnel",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "waterway-tunnel",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "rgba(138, 197, 213, 1)",
          "line-dasharray": [
            3,
            3
          ],
          "line-gap-width": {
            "stops": [
              [
                12,
                0
              ],
              [
                20,
                6
              ]
            ]
          },
          "line-opacity": 1,
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                8,
                1
              ],
              [
                20,
                2
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "waterway",
        "type": "line"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "!in",
            "brunnel",
            "tunnel",
            "bridge"
          ]
        ],
        "id": "waterway",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "waterway",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "rgba(138, 197, 213, 1)",
          "line-opacity": 1,
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                8,
                1
              ],
              [
                20,
                8
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "waterway",
        "type": "line"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "tunnel"
          ],
          [
            "==",
            "class",
            "transit"
          ]
        ],
        "id": "tunnel_railway_transit",
        "layout": {
          "line-cap": "butt",
          "line-join": "miter",
          "visibility": "visible"
        },
        "metadata": {
          "name": "tunnel_railway_transit",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 0,
        "paint": {
          "line-color": "hsl(34, 12%, 66%)",
          "line-dasharray": [
            3,
            3
          ],
          "line-opacity": {
            "base": 1,
            "stops": [
              [
                11,
                0
              ],
              [
                16,
                1
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all"
        ],
        "id": "building",
        "layout": {
          "visibility": "visible"
        },
        "maxzoom": 16,
        "metadata": {
          "name": "building",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-antialias": true,
          "fill-color": "rgba(222, 222, 222, 1)",
          "fill-opacity": {
            "base": 1,
            "stops": [
              [
                13,
                0
              ],
              [
                15,
                1
              ]
            ]
          },
          "fill-outline-color": {
            "stops": [
              [
                15,
                "rgba(212, 177, 146, 0)"
              ],
              [
                16,
                "rgba(212, 177, 146, 0.5)"
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "building",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Point"
          ]
        ],
        "id": "housenumber",
        "layout": {
          "text-field": "{housenumber}",
          "text-font": [
            "Noto Sans Regular"
          ],
          "text-size": 10,
          "visibility": "none"
        },
        "metadata": {
          "name": "housenumber",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 17,
        "paint": {
          "text-color": "rgba(212, 177, 146, 1)"
        },
        "source": "basic",
        "source-layer": "housenumber",
        "type": "symbol",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Polygon"
          ],
          [
            "in",
            "brunnel",
            "bridge"
          ]
        ],
        "id": "road_bridge_area",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "road_bridge_area",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "fill-color": "hsl(47, 26%, 88%)",
          "fill-opacity": 0.5
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "fill",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "in",
            "class",
            "path",
            "track"
          ]
        ],
        "id": "road_path",
        "layout": {
          "line-cap": "square",
          "line-join": "bevel",
          "visibility": "visible"
        },
        "metadata": {
          "name": "road_path",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "hsl(0, 0%, 97%)",
          "line-dasharray": [
            1,
            1
          ],
          "line-width": {
            "base": 1.55,
            "stops": [
              [
                4,
                0.25
              ],
              [
                20,
                10
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "in",
            "class",
            "minor",
            "service"
          ]
        ],
        "id": "road_minor",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "name": "road_minor",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 13,
        "paint": {
          "line-color": "hsl(0, 0%, 97%)",
          "line-width": {
            "base": 1.55,
            "stops": [
              [
                4,
                0.25
              ],
              [
                20,
                30
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "tunnel"
          ],
          [
            "==",
            "class",
            "minor_road"
          ]
        ],
        "id": "tunnel_minor",
        "layout": {
          "line-cap": "butt",
          "line-join": "miter",
          "visibility": "visible"
        },
        "metadata": {
          "name": "tunnel_minor",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "#efefef",
          "line-dasharray": [
            0.36,
            0.18
          ],
          "line-width": {
            "base": 1.55,
            "stops": [
              [
                4,
                0.25
              ],
              [
                20,
                30
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "tunnel"
          ],
          [
            "in",
            "class",
            "primary",
            "secondary",
            "tertiary",
            "trunk"
          ]
        ],
        "id": "tunnel_major",
        "layout": {
          "line-cap": "butt",
          "line-join": "miter",
          "visibility": "visible"
        },
        "metadata": {
          "name": "tunnel_major",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "#fff",
          "line-dasharray": [
            0.28,
            0.14
          ],
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                6,
                0.5
              ],
              [
                20,
                30
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Polygon"
          ],
          [
            "in",
            "class",
            "runway",
            "taxiway"
          ]
        ],
        "id": "aeroway-area",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "mapbox:group": "1444849345966.4436",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 4,
        "paint": {
          "fill-color": "rgba(255, 255, 255, 1)",
          "fill-opacity": {
            "base": 1,
            "stops": [
              [
                13,
                0
              ],
              [
                14,
                1
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "aeroway",
        "type": "fill"
      },
      {
        "filter": [
          "all",
          [
            "in",
            "class",
            "taxiway"
          ],
          [
            "==",
            "$type",
            "LineString"
          ]
        ],
        "id": "aeroway-taxiway",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "mapbox:group": "1444849345966.4436",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 12,
        "paint": {
          "line-color": "rgba(255, 255, 255, 1)",
          "line-opacity": 1,
          "line-width": {
            "base": 1.5,
            "stops": [
              [
                12,
                1
              ],
              [
                17,
                10
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "aeroway",
        "type": "line"
      },
      {
        "filter": [
          "all",
          [
            "in",
            "class",
            "runway"
          ],
          [
            "==",
            "$type",
            "LineString"
          ]
        ],
        "id": "aeroway-runway",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "mapbox:group": "1444849345966.4436",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 4,
        "paint": {
          "line-color": "rgba(255, 255, 255, 1)",
          "line-opacity": 1,
          "line-width": {
            "base": 1.5,
            "stops": [
              [
                11,
                4
              ],
              [
                17,
                50
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "aeroway",
        "type": "line"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "in",
            "class",
            "trunk",
            "primary"
          ]
        ],
        "id": "road_trunk_primary",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "name": "road_trunk_primary",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "#fff",
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                6,
                0.5
              ],
              [
                20,
                30
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "in",
            "class",
            "secondary",
            "tertiary"
          ]
        ],
        "id": "road_secondary_tertiary",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "name": "road_secondary_tertiary",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "#fff",
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                6,
                0.5
              ],
              [
                20,
                20
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "class",
            "motorway"
          ]
        ],
        "id": "road_major_motorway",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "name": "road_major_motorway",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "hsl(0, 0%, 100%)",
          "line-offset": 0,
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                8,
                1
              ],
              [
                16,
                10
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "oneway",
            -1
          ]
        ],
        "id": "road_oneway_opposite",
        "layout": {
          "icon-image": "oneway",
          "icon-padding": 2,
          "icon-rotate": 180,
          "icon-rotation-alignment": "map",
          "icon-size": {
            "stops": [
              [
                15,
                0.5
              ],
              [
                19,
                1
              ]
            ]
          },
          "symbol-placement": "line",
          "symbol-spacing": 200,
          "visibility": "none"
        },
        "metadata": {
          "name": "road_oneway_opposite",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 15,
        "paint": {
          "icon-opacity": 0.5
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "symbol",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "class",
            "transit"
          ],
          [
            "!=",
            "brunnel",
            "tunnel"
          ]
        ],
        "id": "railway-transit",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "railway-transit",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "hsl(34, 12%, 66%)",
          "line-opacity": {
            "base": 1,
            "stops": [
              [
                11,
                0
              ],
              [
                16,
                1
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "class",
            "rail"
          ]
        ],
        "id": "railway",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "railway",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "hsl(34, 12%, 66%)",
          "line-opacity": {
            "base": 1,
            "stops": [
              [
                11,
                0
              ],
              [
                16,
                1
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "bridge"
          ]
        ],
        "id": "waterway-bridge-case",
        "layout": {
          "line-cap": "butt",
          "line-join": "miter",
          "visibility": "visible"
        },
        "metadata": {
          "name": "waterway-bridge-case",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "#bbbbbb",
          "line-gap-width": {
            "base": 1.55,
            "stops": [
              [
                4,
                0.25
              ],
              [
                20,
                30
              ]
            ]
          },
          "line-width": {
            "base": 1.6,
            "stops": [
              [
                12,
                0.5
              ],
              [
                20,
                10
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "waterway",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "bridge"
          ]
        ],
        "id": "waterway-bridge",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "name": "waterway-bridge",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "rgba(138, 197, 213, 1)",
          "line-width": {
            "base": 1.55,
            "stops": [
              [
                4,
                0.25
              ],
              [
                20,
                30
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "waterway",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "bridge"
          ],
          [
            "==",
            "class",
            "minor_road"
          ]
        ],
        "id": "bridge_minor case",
        "layout": {
          "line-cap": "butt",
          "line-join": "miter",
          "visibility": "visible"
        },
        "metadata": {
          "name": "bridge_minor case",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "#dedede",
          "line-gap-width": {
            "base": 1.55,
            "stops": [
              [
                4,
                0.25
              ],
              [
                20,
                30
              ]
            ]
          },
          "line-width": {
            "base": 1.6,
            "stops": [
              [
                12,
                0.5
              ],
              [
                20,
                10
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "bridge"
          ],
          [
            "in",
            "class",
            "primary",
            "secondary",
            "tertiary",
            "trunk"
          ]
        ],
        "id": "bridge_major case",
        "layout": {
          "line-cap": "butt",
          "line-join": "miter",
          "visibility": "visible"
        },
        "metadata": {
          "name": "bridge_major case",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "#dedede",
          "line-gap-width": {
            "base": 1.55,
            "stops": [
              [
                4,
                0.25
              ],
              [
                20,
                30
              ]
            ]
          },
          "line-width": {
            "base": 1.6,
            "stops": [
              [
                12,
                0.5
              ],
              [
                20,
                10
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "bridge"
          ],
          [
            "==",
            "class",
            "minor_road"
          ]
        ],
        "id": "bridge_minor",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "name": "bridge_minor",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "#efefef",
          "line-width": {
            "base": 1.55,
            "stops": [
              [
                4,
                0.25
              ],
              [
                20,
                30
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ],
          [
            "==",
            "brunnel",
            "bridge"
          ],
          [
            "in",
            "class",
            "primary",
            "secondary",
            "tertiary",
            "trunk"
          ]
        ],
        "id": "bridge_major",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "name": "bridge_major",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "#fff",
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                6,
                0.5
              ],
              [
                20,
                30
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "transportation",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "in",
            "admin_level",
            4,
            6,
            8
          ]
        ],
        "id": "admin_sub",
        "layout": {
          "visibility": "visible"
        },
        "metadata": {
          "name": "admin_sub",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "hsla(0, 0%, 60%, 0.5)",
          "line-dasharray": [
            2,
            1
          ]
        },
        "source": "basic",
        "source-layer": "boundary",
        "type": "line"
      },
      {
        "filter": [
          "all",
          [
            "<=",
            "admin_level",
            2
          ],
          [
            "==",
            "$type",
            "LineString"
          ]
        ],
        "id": "admin_country",
        "layout": {
          "line-cap": "round",
          "line-join": "round",
          "visibility": "visible"
        },
        "metadata": {
          "name": "admin_country",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "line-color": "hsl(0, 0%, 60%)",
          "line-width": {
            "base": 1.3,
            "stops": [
              [
                3,
                0.5
              ],
              [
                22,
                15
              ]
            ]
          }
        },
        "source": "basic",
        "source-layer": "boundary",
        "type": "line",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Point"
          ],
          [
            "==",
            "rank",
            1
          ]
        ],
        "id": "poi_label",
        "layout": {
          "icon-size": 1,
          "text-anchor": "top",
          "text-field": "{name}",
          "text-font": [
            "Noto Sans Regular"
          ],
          "text-max-width": 8,
          "text-offset": [
            0,
            0.5
          ],
          "text-size": 11,
          "visibility": "none"
        },
        "metadata": {
          "name": "poi_label",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 14,
        "paint": {
          "text-color": "#666",
          "text-halo-blur": 1,
          "text-halo-color": "rgba(255,255,255,0.75)",
          "text-halo-width": 1
        },
        "source": "basic",
        "source-layer": "poi",
        "type": "symbol"
      },
      {
        "filter": [
          "all",
          [
            "has",
            "iata"
          ]
        ],
        "id": "airport-label",
        "layout": {
          "icon-size": 1,
          "text-anchor": "top",
          "text-field": "{name}",
          "text-font": [
            "Noto Sans Regular"
          ],
          "text-max-width": 8,
          "text-offset": [
            0,
            0.5
          ],
          "text-size": 11,
          "visibility": "none"
        },
        "metadata": {
          "name": "airport-label",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 10,
        "paint": {
          "text-color": "#666",
          "text-halo-blur": 1,
          "text-halo-color": "rgba(255,255,255,0.75)",
          "text-halo-width": 1
        },
        "source": "basic",
        "source-layer": "aerodrome_label",
        "type": "symbol"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "LineString"
          ]
        ],
        "id": "road_major_label",
        "layout": {
          "symbol-placement": "line",
          "text-field": "{name}",
          "text-font": [
            "Noto Sans Regular"
          ],
          "text-letter-spacing": 0.1,
          "text-rotation-alignment": "map",
          "text-size": {
            "base": 1.4,
            "stops": [
              [
                10,
                8
              ],
              [
                20,
                14
              ]
            ]
          },
          "text-transform": "uppercase",
          "visibility": "none"
        },
        "metadata": {
          "name": "road_major_label",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "text-color": "#000",
          "text-halo-color": "hsl(0, 0%, 100%)",
          "text-halo-width": 2
        },
        "source": "basic",
        "source-layer": "transportation_name",
        "type": "symbol",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Point"
          ],
          [
            "!in",
            "class",
            "city",
            "state",
            "country",
            "continent"
          ]
        ],
        "id": "place_label_other",
        "layout": {
          "text-anchor": "center",
          "text-field": "{name}",
          "text-font": [
            "Noto Sans Regular"
          ],
          "text-max-width": 6,
          "text-size": {
            "stops": [
              [
                6,
                10
              ],
              [
                12,
                14
              ]
            ]
          },
          "visibility": "none"
        },
        "metadata": {
          "name": "place_label_other",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "minzoom": 8,
        "paint": {
          "text-color": "hsl(0, 0%, 25%)",
          "text-halo-blur": 0,
          "text-halo-color": "hsl(0, 0%, 100%)",
          "text-halo-width": 2
        },
        "source": "basic",
        "source-layer": "place",
        "type": "symbol"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Point"
          ],
          [
            "==",
            "class",
            "city"
          ]
        ],
        "id": "place_label_city",
        "layout": {
          "text-field": "{name}",
          "text-font": [
            "Noto Sans Regular"
          ],
          "text-max-width": 10,
          "text-size": {
            "stops": [
              [
                3,
                12
              ],
              [
                8,
                16
              ]
            ]
          },
          "visibility": "none"
        },
        "maxzoom": 16,
        "metadata": {
          "name": "place_label_city",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "text-color": "hsl(0, 0%, 0%)",
          "text-halo-blur": 0,
          "text-halo-color": "hsla(0, 0%, 100%, 0.75)",
          "text-halo-width": 2
        },
        "source": "basic",
        "source-layer": "place",
        "type": "symbol",
        "visibility": "visible"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Point"
          ],
          [
            "==",
            "class",
            "country"
          ],
          [
            "!has",
            "iso_a2"
          ]
        ],
        "id": "country_label-other",
        "layout": {
          "text-field": "{name}",
          "text-font": [
            "Noto Sans Regular"
          ],
          "text-max-width": 10,
          "text-size": {
            "stops": [
              [
                3,
                12
              ],
              [
                8,
                22
              ]
            ]
          },
          "visibility": "none"
        },
        "maxzoom": 12,
        "metadata": {
          "name": "country_label-other",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "text-color": "hsl(0, 0%, 13%)",
          "text-halo-blur": 0,
          "text-halo-color": "rgba(255,255,255,0.75)",
          "text-halo-width": 2
        },
        "source": "basic",
        "source-layer": "place",
        "type": "symbol"
      },
      {
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Point"
          ],
          [
            "==",
            "class",
            "country"
          ],
          [
            "has",
            "iso_a2"
          ]
        ],
        "id": "country_label",
        "layout": {
          "text-field": "{name}",
          "text-font": [
            "Noto Sans Regular"
          ],
          "text-max-width": 10,
          "text-size": {
            "stops": [
              [
                3,
                12
              ],
              [
                8,
                22
              ]
            ]
          },
          "visibility": "none"
        },
        "maxzoom": 12,
        "metadata": {
          "name": "country_label",
          "group": "atlasdata-group-bde6bdaa1b"
        },
        "paint": {
          "text-color": "hsl(0, 0%, 13%)",
          "text-halo-blur": 0,
          "text-halo-color": "rgba(255,255,255,0.75)",
          "text-halo-width": 2
        },
        "source": "basic",
        "source-layer": "place",
        "type": "symbol"
      },
      {
        "id": "atlasdata-group-bde6bdaa1b",
        "type": "background",
        "metadata": {
          "isGroup": true,
          "name": "亮色底图",
          "visibility": "visible",
          "isExpanded": false
        },
        "paint": {
          "background-color": "rgba(0,0,0,0)"
        },
        "layout": {
          "visibility": "none"
        }
      },
      {
        "id": "atlasdata-ext-layer-ace75c09c0",
        "type": "raster",
        "source": "atlas-basemap-tianditu-3",
        "metadata": {
          "name": "天地图影像",
          "group": "atlasdata-group-9dcae8aa97"
        },
        "layout": {
          "visibility": "none"
        },
        "paint": {},
        "filter": [
          "all"
        ]
      },
      {
        "id": "atlasdata-ext-layer-a0458ac909",
        "type": "raster",
        "source": "atlas-basemap-tianditu-4",
        "metadata": {
          "name": "天地图影像标注",
          "group": "atlasdata-group-9dcae8aa97"
        },
        "layout": {
          "visibility": "none"
        },
        "paint": {},
        "filter": [
          "all"
        ]
      },
      {
        "id": "atlasdata-ext-layer-aff31f8bd5",
        "type": "raster",
        "source": "atlas-basemap-tianditu-1",
        "metadata": {
          "name": "天地图矢量",
          "group": "atlasdata-group-b51b10daa8"
        },
        "layout": {
          "visibility": "none"
        },
        "paint": {},
        "filter": [
          "all"
        ],
        "visibility": "visible"
      },
      {
        "id": "atlasdata-ext-layer-aa98d878ea",
        "type": "raster",
        "source": "atlas-basemap-tianditu-2",
        "metadata": {
          "name": "天地图矢量标注",
          "group": "atlasdata-group-b51b10daa8"
        },
        "layout": {
          "visibility": "none"
        },
        "paint": {},
        "filter": [
          "all"
        ],
        "visibility": "visible"
      },
      {
        "id": "atlasdata-group-b51b10daa8",
        "type": "background",
        "metadata": {
          "isGroup": true,
          "name": "天地图-矢量栅格",
          "visibility": "none",
          "isExpanded": false
        },
        "paint": {
          "background-color": "rgba(0,0,0,0)"
        },
        "layout": {
          "visibility": "none"
        }
      },
      {
        "id": "atlasdata-group-9dcae8aa97",
        "type": "background",
        "metadata": {
          "isGroup": true,
          "name": "天地图-影像",
          "visibility": "none",
          "isExpanded": false
        },
        "paint": {
          "background-color": "rgba(0,0,0,0)"
        },
        "layout": {
          "visibility": "none"
        }
      },
      {
        "id": "atlasdata-ext-layer-a9be771890",
        "type": "raster",
        "source": "atlas-base-map-google-2",
        "metadata": {
          "name": "谷歌影像",
          "group": "atlasdata-group-8927601ab7"
        },
        "layout": {
          "visibility": "none"
        },
        "paint": {},
        "filter": [
          "all"
        ],
        "visibility": "visible"
      },
      {
        "id": "atlasdata-ext-layer-95aaf118f7",
        "type": "raster",
        "source": "atlas-basemap-tianditu-4",
        "metadata": {
          "name": "天地图影像标注",
          "group": "atlasdata-group-8927601ab7"
        },
        "layout": {
          "visibility": "none"
        },
        "paint": {},
        "filter": [
          "all"
        ],
        "visibility": "visible"
      },
      {
        "id": "atlasdata-group-8927601ab7",
        "type": "background",
        "metadata": {
          "isGroup": true,
          "name": "谷歌影像",
          "visibility": "none",
          "isExpanded": false
        },
        "paint": {
          "background-color": "rgba(0,0,0,0)"
        },
        "layout": {
          "visibility": "none"
        }
      },
      {
        "id": "atlasdata-ext-layer-a203dceb79",
        "type": "fill",
        "source": "flvQUDzWg",
        "source-layer": "重庆市",
        "metadata": {
          "name": "重庆市",
          "group": "atlasdata-group-8b468849cc"
        },
        "paint": {
          "fill-color": "rgb(183, 236, 189)"
        },
        "layout": {
          "visibility": "visible"
        },
        "filter": [
          "all"
        ]
      },
      {
        "id": "atlasdata-ext-layer-9abc81a8e2",
        "type": "fill",
        "source": "flvQUDzWg",
        "source-layer": "片区",
        "metadata": {
          "name": "片区",
          "group": "atlasdata-group-8b468849cc"
        },
        "paint": {
          "fill-color": "rgb(246, 111, 21)",
          "fill-outline-color": "rgba(65, 6, 6, 1)",
          "fill-opacity": 1
        },
        "layout": {},
        "filter": [
          "all"
        ],
        "maxzoom": 7,
        "minzoom": 0,
        "visibility": "visible"
      },
      {
        "id": "atlasdata-ext-layer-879da0b8bd",
        "type": "symbol",
        "source": "flvQUDzWg",
        "source-layer": "片区",
        "metadata": {
          "name": "片区标注",
          "group": "atlasdata-group-8b468849cc",
          "oldType": "fill"
        },
        "paint": {
          "text-halo-width": 2,
          "text-halo-color": "rgba(255, 255, 255, 1)"
        },
        "layout": {
          "text-field": "{name}",
          "text-size": 20,
          "text-allow-overlap": false,
          "text-ignore-placement": false,
          "text-optional": false,
          "text-justify": "center",
          "symbol-placement": "point"
        },
        "filter": [
          "all"
        ],
        "maxzoom": 7,
        "visibility": "visible"
      },
      {
        "id": "atlasdata-ext-layer-9f765ec8af",
        "type": "fill",
        "source": "flvQUDzWg",
        "source-layer": "区县",
        "metadata": {
          "name": "区县",
          "group": "atlasdata-group-8b468849cc"
        },
        "paint": {
          "fill-color": "rgb(204, 65, 32)",
          "fill-outline-color": "rgba(30, 29, 29, 1)"
        },
        "layout": {
          "visibility": "visible"
        },
        "filter": [
          "all"
        ]
      },
      {
        "id": "atlasdata-ext-layer-842bc6c90c",
        "type": "symbol",
        "source": "flvQUDzWg",
        "source-layer": "行政中心",
        "metadata": {
          "name": "区县行政中心",
          "group": "atlasdata-group-8b468849cc",
          "oldType": "circle"
        },
        "paint": {
          "text-halo-color": "rgba(255, 255, 255, 1)",
          "text-halo-width": 2
        },
        "layout": {
          "text-field": "{name}",
          "text-size": 14,
          "visibility": "visible"
        },
        "filter": [
          "all"
        ]
      },
      {
        "id": "atlasdata-ext-layer-ab797f38c1",
        "type": "circle",
        "source": "flvQUDzWg",
        "source-layer": "园区",
        "metadata": {
          "name": "园区",
          "group": "atlasdata-group-8b468849cc"
        },
        "paint": {
          "circle-color": "rgb(27, 251, 165)"
        },
        "layout": {
          "visibility": "visible"
        },
        "filter": [
          "all"
        ]
      },
      {
        "id": "atlasdata-group-8b468849cc",
        "type": "background",
        "metadata": {
          "isGroup": true,
          "name": "重庆",
          "visibility": "none",
          "isExpanded": true
        },
        "paint": {
          "background-color": "rgba(0,0,0,0)"
        },
        "layout": {
          "visibility": "none"
        }
      }
    ]
  }