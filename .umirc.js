const env = process.env.NODE_ENV;
// const host = env === 'dev' ? 'http://'
// console.log(env)
// ref: https://umijs.org/config/
export default {
  base: './',
  publicPath: './',
  targets: {
    ie: 11,
  },
  hash: true,
  runtimePublicPath: true,
  exportStatic: false,
  history: 'hash',
  define: {
    // 'DEV_HOST': 'http://47.100.237.57:1226/',
    // 'DEV_WEBSITE' : 'http://127.0.0.1:8215/atlas/products/cloud-app/public/'
  },
  copy: [
    // { form: 'statics/map',  to: 'dist/map' },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: {
        immer: true
      },
      dynamicImport: true,
      title: 'atlascloud',
      dll: false,
      routes: {
        exclude: [],
      },
      hardSource: false,
    }],
  ],
}
