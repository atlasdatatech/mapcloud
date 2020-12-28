var AppConfig = {
    id: '', 
    title: '', // 名称
    summary: '', // 简介
    userID: '', // 用户ID
    user:'', // 用户名称
    password: '', // 访问密码
    createTime: '', // 创建时间
    updateTime: '', // 更新时间
    map: { // 地图可视化配置
        style: '', // 样式ID或样式配置，以mapbox style 为准
        layers: [],  // 图层配置，以mapbox style 为准
    },
    filters: [{ // 过滤设置,最终会拼成Sql   
        // where source.field > start and source.field < end  and...
        // 如果 start === end 则是 
        // where source.field = start  and...
        
        source: '', //对应的数据源/图层
        field: '', // 对应的属性字段,
        start: 0, // 起始值
        end: 0,  // 结束值
        current: 0 // 当前值
    }],
    chart: [{ // 统计分析
        id: '',
        title: '',
        type: '', // 图表类型, 柱状图, 折线图， 饼图
        source: '', // 对应数据源/图层
        dimension: [{field:'', sort:'desc'}], // 维度
        measure: [
            {field: '', type: 'sum', chartType: 'line', color: '', sort:'', config:{}},
        ], 
        // 度量, 柱状图/折线图 2个， 饼图1个,
        // type: sum, avg, count
        filter: [
            {field: '', start: '', end: '', values: []},
        ],
    }],
}