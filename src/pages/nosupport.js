import classNames from 'classnames';
import styles from './nosupport.less';
import router from 'umi/router';

export default () => {
    const support = window.atlas && atlas.supported();
    if(support) {
        router.goBack();
    }
    if(support) return null;
    return (
        <div className={classNames(styles.wrapper, 'pd-5')}>
            <div className={styles.no}><span>不支持 WebGL !!!</span></div>
            <h3>:) 很遗憾，您的访问环境不支持 WebGL 地图加载</h3>
            <p>温馨提示：</p>
            <p>请使用支持WebGL技术的浏览器，升级您的浏览器到最新版看看是否支持</p>
            <p>建议使用最新版的Chrome浏览器访问地图云</p>
        </div>
    );
}