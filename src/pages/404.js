import classNames from 'classnames';
import styles from './404.less';

export default () => {
    return (
        <div className={classNames(styles.wrapper, 'pd-5')}>
            <img src="./images/404.png" title="404" />
            <h3>404 :) 很抱歉，您要访问的页面不存在！</h3>
            <p>温馨提示：</p>
            <p>请检查您访问的网址是否正确</p>
            <p>如有任何意见或建议，请及时反馈给我们</p>
        </div>
    );
}