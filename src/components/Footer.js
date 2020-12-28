import { Component } from 'react';
import classNames from 'classnames';
import styles from './Footer.less';

export default class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={classNames(styles.footer, 'pt-2 pb-3')}>
                <p>
                    <a href="http://www.atlasdata.cn" target="_blank">舆图数据官网</a>
                    <a href="http://www.atlasdata.cn/dev" target="_blank">开发者文档</a>
                    <a href="http://www.atlasdata.cn/about/#contact" target="_blank">联系我们</a>
                </p>
                <p>
                    copyright &copy; <a href='http://www.atlasdata.cn' target="_blank">AtlasData.cn</a> 版权所有 <a href='http://www.atlasdata.cn' target="_blank">舆图数据</a>
                </p>
            </div>
        );
    }
}