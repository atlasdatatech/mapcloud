// type, label, min, max, unit, value, input, require, ignore, relation, disable
/**
 * type, 类型，t:transitionable
 * require 前置要求，说明： | 或， + 代表右侧是左侧的值, * 代表多个值
 * relation 关联选项，两个选项间存在某种关联
 * ignore  忽略此选项，隐藏某些选项
 * disable 检查某个属性是否有值，有则不可设置
 */
export const symbol = {
    layout: {
        "visibility": {type:'boolean', label:'显示图层', value: 'visible', note:''},
        "icon-image": {type: 'string', label:'图标字段', input:'input',value:'',note:'', title:'用于绘制图像背景的sprite中图像的名称'},
        "icon-size": {type: 'number', label:'图标缩放比例', value: 1, step:0.1, input:'input',title:'缩放图标的原始大小' , require:'icon-image'},
        "icon-offset": {type:'array<number>', label:'图标偏移', unit:'px',step:1, length: 2, require:'icon-image', value:[0,0], inputLabel:'x|y', input:'input'},
        "icon-rotate": {type: 'number', label: '图标旋转', step:0.1, unit:'°', value:0, input:'text', require:'icon-image', title:'', input:'input'},
        "icon-padding": {type: 'number', label:'图标内边距', step:1, unit:'px',title:'用于检测符号碰撞的图标边界框周围的附加区域的大小', value:2,require:'icon-image', input:'input'},
        "text-field": {type:'string', label:'文字字段', note:'',value:'', title:'用于文本标签的值。如果提供不带括号的纯字符串，它将被视为使用默认字符串。', input:'input'},
        "text-size": {type: 'number', label:'字体大小', value:16, step:1, unit:'px', input:'input'},
        "symbol-placement": {type: 'string', label:'符号相对位置', value: "point|line|line-center",input:'select', title:'相对于其图形的标签位置'},
        "symbol-spacing": {type: 'number', unit:'px',label:'符号间距', step:1, min:1, input:'input', value:250, require:'symbol-placement+line', title:'两个符号锚之间的距离'},
        "symbol-avoid-edges": {type: 'boolean', label: '符号边缘压盖', value: false, input:'switch', title:'如果选中，符号不会穿过瓷砖边缘以避免相互碰撞'},
        "symbol-z-order": {type:'string', label:'符号堆叠顺序', value:'auto|viewport-y|source', input:'select',title:'控制同一层中重叠符号的呈现顺序'},
        "icon-allow-overlap": {type: 'boolean', value: false, label:'图标允许堆叠', title:'如果选中，则图标将可见，即使它与以前绘制的其他符号冲突', require:'icon-image'},
        "icon-ignore-placement": {type: 'boolean', value:false, label:'图标禁止避让', title:'如果选中，则即使其他符号与图标冲突，也可以看到它们。', require:'icon-image'},
        "icon-optional": {type: 'boolean', value:false, label:'图标渲染时可选', title:'如果选中，则当图标与其他符号冲突而文本不显示相应的图标时，文本将不显示相应的图标。', require:'text-field|icon-image'},
        "icon-rotation-alignment": {type: 'string',label:'图标旋转基准', value: 'auto|map|viewport', input:'select',require: 'icon-image', title:'结合符号放置，确定图标的旋转行为。'},
        "icon-text-fit": {type:'string', label: '图标适应文字尺寸方式', value:'none|width|height|both',input:'select',title:'缩放图标以适应文本。',require:'text-field|icon-image'},
        "icon-text-fit-padding": {type: 'array<number>', label:'图标适应文字尺寸(带边距)', value:[0,0,0,0],length: 4, input:'input',min:0, step:1, inputLabel:'上|右|下|左',unit:'px',require:'text-field|icon-image|icon-text-fit+both*width*height', title:'添加到由图标文本大小决定的尺寸的附加区域的大小，按顺时针顺序：顶部、右侧、底部、左侧'},
        "icon-keep-upright": {type: 'boolean',label:'图标始终朝上', require:'icon-image|icon-rotation-alignment+map|symbol-placement+line*line-center',title:'图标始终朝上，此选项要求图标旋转基准为地图，或符号相对位置为线或线中心，否则不可设置'},
        "icon-anchor": {type:'string', label:'图标对齐',title:'最靠近定位点的部分图标', value:"center|left|right|top|bottom|top-left|top-right|bottom-left|bottom-right",require:'icon-image', input:'select'},
        "icon-pitch-alignment": {type:'string', value:"auto|map|viewport", require:'icon-image', label:'图标排列方向', title:'Orientation of icon when map is pitched.', input:'select'},
        "text-rotation-alignment": {type:'string', label:'文字旋转对齐', value:"auto|map|viewport", title:'结合符号放置，确定构成文本的单个字形的旋转行为。', input:'select'},
        "text-offset":  {type:'array<number>', value:[0,0],  label:'文字偏移', length: 2, unit:'ems', require:'text-field', input:'input', inputLabel:'x|y', step: 0.1},
        "text-font": {type:'array<string>', label:'字体', require:'text-field', value:["Open Sans Regular","Arial Unicode MS Regular"], title:'["Open Sans Regular","Arial Unicode MS Regular"]', input:'select', ignore:true},
        "text-max-width": {type: 'number', label:'文字最大宽度',min:0, step:1,unit:'ems', require:'text-field', value:10, input:'input'},
        "text-line-height": {type: 'number',label:'文字行高', min:1, step:0.1, unit:'ems', value:1.2, input:'input', require:'text-field'},
        "text-letter-spacing": {type: 'number', label:'文字字间距',min:0, step:0.1,value:0, unit:'ems',input:'input', require:'text-field'},
        "text-justify": {type:'string', value:"center|left|right", label:'文字对齐方式', input:'select', require:'text-field'},
        "text-anchor": {type:'string', label:'文字定位点对齐', value:"center|left|right|top|bottom|top-left|top-right|bottom-left|bottom-right", require:'text-field', input:'select'},
        "text-max-angle": {type: 'number', label:'文字最大角度', step:1,value:45, min:-360, max:360, unit: '°', require:'text-field|symbol-placement+line*line-center', title:'相邻字符之间的最大角度变化', input:'slider'},
        "text-rotate": {type: 'number', step:1, label:'文字旋转', min:-360, max:360,unit: '°', require:'text-field',value:0, input:'slider'},
        "text-padding": {type: 'number',label:'文字内边距', unit:'px', step:1,value:2, require:'text-field', input:'input'},
        "text-keep-upright": {type: 'boolean', label:'文字始终朝上',require:'text-field|text-rotation-alignment+map|symbol-placement+line*line-center', value: true, title:'文字始终朝上，此选项要求文字旋转基准为地图，或符号相对位置为线或线中心，否则不可设置'},
        "text-transform": {type:'string', label:'文字英文大小写', value:"none|uppercase|lowercase", require:'text-field', input:'select'},
        "text-allow-overlap": {type: 'boolean', require:'text-field', label:'文字允许压盖', value:false, title:'如果选中，则文本将可见，即使它与以前绘制的其他符号冲突。'},
        "text-ignore-placement": {type: 'boolean', require:'text-field', label:'文字禁止避让', value:false, title:'如果选中，则即使其他符号与文本冲突，也可以看到它们。'},
        "text-optional": {type: 'boolean', require:'text-field|icon-image', value:false, label:'文字渲染时可选'},
    },
    paint: {
        "icon-color": {type:'color', label:'图标颜色', require:'icon-image', ignore:true},
        "icon-opacity": {type:'number', label:'图标透明度', value:1, min:0, max:1, step:0.1,input:'slider', require:'icon-image'},
        "text-opacity": {type:'number', require:'text-field', label:'文字透明度', value:1, min:0, max:1,step:0.1, input:'slider'},
        "text-color": {type:'color', require:'text-field', value:'#000000', input:'color',label:'文字颜色'},
        "icon-halo-color": {type:'color', label:'图标阴影', value:'#000000', require:'icon-image', ignore: true},
        "icon-halo-width": {type:'number', label:'图标阴影大小',min:0, step:1, require:'icon-image', value:0, unit:'px', input:'input', ignore: true,},
        "icon-halo-blur": {type:'number', require:'icon-image',min:0, step:1, label:'图标阴影模糊', value:0, unit:'px',input:'input', ignore: true,},
        "icon-translate": {type:'array<number>', label:'平移', unit:'px',length:2,step:1, label:'图标平移',require:'icon-image', value:[0,0], input:'input',inputLabel:'x|y'},
        "icon-translate-anchor": {type:'string', value:"map|viewport", require:'icon-image', label:'图标平移基准', input:'select'}, 
        "text-halo-color": {type:'color', require:'text-field', input:'color',value:'#FFFFFF' ,label:'文字轮廓颜色'},
        "text-halo-width": {type:'number', require:'text-field', value:0, step:1, min:0, input: 'input', label:'文字轮廓宽度',unit:'px'},
        "text-halo-blur": {type:'number', require:'text-field', value:0, step:1, min:0, label:'文字轮廓模糊', input:'input',unit:'px'},
        "text-translate": {type:'array<number>', length:2, require:'text-field', label:'文字平移', value:[0,0],input:'input', inputLabel:'x|y', unit:'px', step:1},
        "text-translate-anchor": {type:'string', value:"map|viewport", require:'text-field', label:'文字平移基准', input:'select'}, 
    }
};

export const raster = {
    layout: {
        "visibility": {type:'boolean', label:'显示图层', value: 'visible', note:''}
    },
    paint: {
        "raster-opacity": {type:'number', label:'透明度', step:0.1, min:0, max:1,input:'slider', value:1},
        "raster-hue-rotate": {type:'number', unit:'°', step:1, min:0, max: 360, value:0, label:'色相旋转', input:'slider'},
        "raster-brightness-min": {type:'number', label:'最小亮度', step:0.1, value:0, input:'slider', min:0,max:1,relation:'brightness'},
        "raster-brightness-max": {type:'number',label:'最大亮度',step:0.1,  value:1, input:'slider', min:0, max:1,relation:'brightness'},
        "raster-saturation": {type:'number', label:'饱和度', value:0, step:0.1, min:-1, max:1, input:'slider'},
        "raster-contrast": {type:'number', label:'对比度', value:0, step:0.1, min:-1, max:1, input:'slider'},
        "raster-resampling": {type:'string', label:'重采样', value:"linear|nearest", input:'select'}, 
        "raster-fade-duration": {type:'number', label:'渐变时长',step:1,  value:300, min:0, input:'input', unit:'ms(毫秒)'},
    }
};

export const line = {
    layout: {
        "visibility": {type:'boolean', label:'显示图层', value: 'visible', note:''},
        "line-cap": {type:'string', value: "butt|round|square", label:'尾部样式', input:'select'},
        "line-join": {type:'string', value: "miter|bevel|round",label:'连接处样式', input:'select'},
        "line-miter-limit": {type:'number', label:'斜接角', step:1, value:2, unit:'°',input:'input',title:'用于自动将斜接转换为锐角的斜接',require:'line-join+miter'},
        "line-round-limit": {type:'number', label:'圆接角', step:0.01, input:'input',unit:'°',title:'用于自动将圆角连接转换为斜接',value:1.05, require:'line-join+round'},
    },
    paint: {
        "line-width": {type:'number', unit:'px', value:1, step:1, input:'input', label:'宽度'},
        "line-color": {type:'color', label:'颜色', value:'#000000'},
        "line-opacity": {type:'number', label:'透明度',step:0.1, min:0, max:1, value:1, input:'slider'},
        "line-blur": {type:'number', min:0, unit:'px', value:0, step:1,  label:'模糊', input:'input'},
        "line-gap-width": {type:'number', unit:'px', value:0, min: 0, step:1, input:'input', label:'间距', title:'在线的实际路径之外绘制线套管，值表示内部间隙的宽度'},
        "line-translate": {type:'array<number>', unit:'px',length: 2,step:1,  label:'平移',input:'input', inputLabel:'x|y', value:[0,0]},
        "line-translate-anchor": {type:'string', value: "map|viewport", label:'平移基准', input:'select', require:'line-translate'},
        "line-offset": {type:'number', unit:'px', value:0, step:1, label:'偏移', input:'input'},
        "line-dasharray": {type:'array<number>', length: 2, step:1, min:0, value:[0,0], label:'线阵列', input:'input', unit:'px',title:'虚线或长短线设置，指定构成短划线图案的交替短划线和间隙的长度。这些长度随后根据线条宽度进行缩放。要将虚线长度转换为像素，请将长度乘以当前的线条宽度。'},
        "line-pattern": {type:'string', label:'填充', input:'input', title:'图标字段名称'},
        "line-gradient": {type: 'color', label:'渐变', input:'input', ignore:true}, // ColorRampProperty
    }
};

export const hillshade = {
    layout: {
        "visibility": {type:'boolean', label:'显示图层', value: 'visible', note:''}
    },
    paint: {
        "hillshade-illumination-direction": {type:'number', step:1, unit:'°', min:0, max: 359, value:335, label:'光照方向', input:'slider'},
        "hillshade-illumination-anchor": {type:'string', value: "viewport|map", input:'select', label:'光照基准'},
        "hillshade-exaggeration": {type:'number',label:'强度',step:0.1,  min:0, max:1, value:0.5,input:'slider'},
        "hillshade-shadow-color": {type:'color', label:'阴影颜色', value:'#000000'},
        "hillshade-highlight-color": {type:'color', label:'高亮颜色', value:'#FFFFFF'},
        "hillshade-accent-color": {type:'color', label:'突出颜色', value:'#000000',title:'阴影颜色用来突出崎岖的地形，如陡峭的悬崖和峡谷'},
    }
};

export const heatmap = {
    layout: {
        "visibility": {type:'boolean', label:'显示图层', value: 'visible', note:''}
    },
    paint: {
        "heatmap-radius": {type:'number', unit: 'px', step:1, min:1, value: 30, label:'半径', input:'input'},
        "heatmap-opacity": {type:'number', label:'透明度',step:0.1, min:0, max:1, value:1, input:'slider'},
        "heatmap-weight": {type:'number', min: 0, value: 1, step:0.1, label:'比重',input:'input', title:'一个点对热力图的贡献程度，10的值相当于在同一个点上有10个重量点1'},
        "heatmap-intensity": {type:'number', min: 0, value: 1,step:0.1, label:'强度', input:'input', title:'类似于比重，但用于全局调整'},
        "heatmap-color": {type:'func<color>', value:["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"],label:'颜色'},
    }
};

export const fill = {
    layout: {
        "visibility": {type:'boolean', label:'显示图层', value: 'visible', note:''}
    },
    paint: {
        "fill-opacity": {type:'number',label:'透明度',step:0.1, min:0, max:1, value:1, input:'slider'},
        "fill-color": {type:'color', label:'颜色', disable:'fill-pattern',value:'#000000'},
        "fill-outline-color": {type:'color', label:'轮廓颜色', disable:'fill-pattern', require:'fill-antialias+true',value:'#000000'},
        "fill-pattern": {type:'string', label:'填充', value:'', input:'input', note:'属性字段', title:'用于绘制图像填充的sprite中图像的名称。对于无缝图案，图像宽度和高度必须是2的倍数（2，4，8，…，512）。请注意，与缩放相关的表达式将仅在整数缩放级别进行计算。'}, 
        "fill-translate": {type:'array<number>', length: 2, step:1, label:'平移',input:'input', inputLabel:'x|y', unit:'px',value:[0,0]},
        "fill-translate-anchor": {type:'string', value: "map|viewport", label:'平移基准', input:'select',require:'fill-translate'},
        "fill-antialias": {type:'boolean', value:true, label:'平滑'},
    }
};

export const fillExtrusion = {
    layout: {
        "visibility": {type:'boolean', label:'显示图层', value: 'visible', note:''}
    },
    paint: {
        "fill-extrusion-opacity": {type:'number',label:'透明度',step:0.1, min:0, max:1, value:1, input:'slider'},
        "fill-extrusion-color": {type:'color', label:'颜色', value:'#000000'},
        "fill-extrusion-height": {type:'number', unit:'米', step:0.1, value:0, min:0,label:'高度',input:'input',title:'挤出该层的高度'},
        "fill-extrusion-base": {type:'number', input:'input', step:0.1, value:0, label:'基高',unit:'米', require:'fill-extrusion-height',title:'挤出该层底部的高度。必须小于或等于填充拉伸高度'},
        "fill-extrusion-translate": {type:'array<number>', step:1, length: 2, label:'平移',input:'input', inputLabel:'x|y', length: 2, value:[0,0],title:'元素位置偏移。值为[x，y]，其中负数分别表示左上'},
        "fill-extrusion-translate-anchor": {type:'string', value: "map|viewport", label:'平移基准', input:'select',require:'fill-extrusion-translate',title:'控制填充拉伸转换的参照框架'},
        "fill-extrusion-pattern": {type:'string', label:'填充', value:'', input:'input', note:'属性字段名',title:'拉伸填充,根据颜色和灯光设置，拉伸的表面将以不同的方式着色。如果将此颜色指定为带alpha组件的rgba，则alpha组件将被忽略'}, 
        "fill-extrusion-vertical-gradient": {type:'boolean', label:'垂直渐变',value:true, title:'是否对填充拉伸层的侧面应用垂直渐变。如果是真的，侧面的阴影会稍微深一。'},
    }
};

export const circle = {
    layout: {
        "visibility": {type:'boolean', label:'显示图层', value: 'visible', note:''}
    },
    paint: {
        "circle-radius": {type:'number', unit: 'px', step:1, min:0, value:5, label:'半径', input:'input'},
        "circle-color": {type:'color', label:'颜色', value:'#000000' },
        "circle-opacity": {type:'number', value:1, step:0.1, min:0, max:1, input:'slider', label:'透明度'},
        "circle-stroke-width": {type:'number', unit: 'px', step:1, label:'描边宽度', value:0, input:'input'},
        "circle-stroke-color": {type:'color', label:'描边颜色', value:'#000000'},
        "circle-stroke-opacity": {type:'number',  value:1, step:0.1, min:0, max:1, label:'描边透明度', input:'slider'},
        "circle-blur": {type:'number', unit: 'px', min:0, step:1, label:'模糊',input:'input', value:0},
        "circle-translate": {type:'array<number>', step:1, label:'平移', input:'input', inputLabel:'x|y', length: 2, value:[0,0], title:'偏移, 值为[x，y]，其中负数分别表示左上'},
        "circle-translate-anchor": {type:'string', value: "map|viewport", label:'平移基准', input:'select',title:'控制元素偏移时的框架'},
        "circle-pitch-scale": {type:'string', label:'俯仰角缩放', value: "map|viewport", input:'select', title:'控制地图倾斜时圆的缩放行为'},
        "circle-pitch-alignment": {type:'string', value: "viewport|map",input:'select',label:'俯仰角缩放对齐', title:'地图倾斜时的元素方向'},
    }
};

export const background = {
    layout: {
        "visibility": {type:'boolean', label:'显示图层', value: 'visible', note:''}
    },
    paint: {
        "background-color": {type:'color', label:'背景色', disable:'background-pattern'},
        "background-pattern": {type:'string', note:'', input:'input', label:'图案填充', title:'图标中用于绘制图像背景的图像的名称。对于无缝图案，图像宽度和高度必须是二的倍数（2，4，8，…，512）。请注意，与缩放相关的表达式将仅在整数缩放级别进行计算。'}, 
        "background-opacity": {type:'number', step:0.1, value:[0,1], input:'slider', min:0, max:1,value:1, label:'透明度'},
    }
}

export const light = {
    anchor: {type: 'string', value: 'viewport|map', label:'光源基准',input:'select'},
    position: {type: 'array<number>',step:1,  length:3, label:'光源位置', input:'input', value:[1.15,210,30], inputLabel:'R径向坐标|方位角|P极角'},
    color: {type: 'color', label:'光源颜色', value:'#FFFFFF'},
    intensity: {type: 'number', min: 0, max: 1, step:0.1, value: 0.5, label:'光源强度', input:'slider'},
}

export const transition = {
    duration: {type: 'number', unit: 'ms',step:1,  value:300, label:'过渡间隔', input:'input'},
    delay: {type: 'number', unit: 'ms', step:1, value:0, label:'过渡延迟', input:'input'}
}

export const style = {
    // metadata: {type: 'object'},
    center: {type:'array<number>', length: 2, value:[0,0], label:'中心点',input:'input', inputLabel:'经度|纬度'},
    zoom: {type:'number', unit: '', value:9, step:1, label:'层级', min:0, max:22, input:'slider'},
    bearing: {type: 'number', unit: '°', step:1, min:-360, max: 360, value:0, label:'方位角', input:'slider'},
    pitch: {type: 'number', value:0, min:0, step:1, max: 60, unit: '°', label:'俯仰角', input:'slider'},
};

// 'vector|raster|raster-dem|geojson|image|video'
export const layer2 = {
    id: {type:'string', value:'', label:'ID'},
    layer:{type:'string', value:'background|raster|circle|fill|fill-extrusion|heatmap|hillshade|line|symbol', label:'图层类型'},
    source: {type:'string', value:'vector|raster|raster-dem|geojson|image|video', label:'数据源类型'},
    "minzoom": {type:'number', min:0, max: 22, type:'range', relation:'zoom'},
    "maxzoom": {type:'number', min:0, max: 22, type:'range', relation:'zoom'},
    "source-layer": {type:'string', value:'', label:'源图层', require:'source+vector'},
    metadata: {type:'object', value:{}, label:'附加信息'}
    // comment: {type:'描述', value:''},
};


export const layer = {
    name: {type:'string', label:'图层名称',value:"新图层", input:'editinput'},
    type: {type:'string', value:'background|raster|circle|fill|fill-extrusion|heatmap|hillshade|line|symbol', label:'图层类型', input:'select'},
    source: {type:'object', value:'vector|raster|raster-dem|geojson|image|video', label:'数据源', input:'modal', ignore: true},
    "source-layer": {type:'string', value:'', label:'源图层', require:'source+vector', ignore: true},
    minzoom: {type:'number', value:0, step:1, min:0, max:22, label:'最小层级',input:'slider'},
    maxzoom: {type:'number', value:22, step:1, min:0, max:22, label:'最大层级', input:'slider'},
};

export const filters = {
    has: ['has', '!has'], // 是否包含， 带key, 不带value
    exp: ['==', '!==', '>', '>=', '<', '<=', 'in', '!in'], // key,value
    in: ['in', '!in'], // 是否在范围内
    range: ['all', 'none', 'any']
};