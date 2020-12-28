# Cloud App 地图云

## 前端技术栈

主要使用 
- 前端基础框架：react
- 项目框架：umi.js
- UI库：blueprint.js
- AJAX库：axios.js

其它依赖详见 package.json

## 项目编译说明

1. 需要事先安装 nodejs V9以上版本，安装 cnpm；
2. 进入目录后安装依赖包, cnpm install
3. 编译：npm run build
4. 调试: npm run start

## 项目目录说明

- dist 编译后目录，最终生成的应用代码，可删除
- node_modules 编译过程中产生的临时依赖包，可删除
- public 公共静态资源目录
- src 应用程序源码
- .editorconfig 编辑器配置
- .env 环境配置
- .eslintrc 代码风格配置
- .gitignore git 忽略配置
- .prettierrc 代码风格化配置
- .prettierignore 代码风格化配置
- .umirc.js umijs 配置
- .theme-config umijs 主题配置

## 源码目录说明

- assets 静态资源目录
- components 公共组件
- layouts 布局
- map 地图
- models 模型
- pages 页面视图
- utils 工具目录
- app.js 应用入口
- config.js host 配置，不要修改，修改host在public下的config目录
- *.less 样式文件

## 页面说明

页面均位于 pages 目录下，

- account 账户
- app 应用
- dataset 数据集
- map 地图
- login 登录

初始化提交时在package.json中省略以下参数，后面需加上

```json
script: {
  "precommit": "lint-staged"
}
```

```json
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "git add"
    ]
  },
```