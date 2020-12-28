import { Component } from 'react';
import classNames from 'classnames';
import styles from './SetBar.less';
import { Divider, Icon, Button } from "@blueprintjs/core";
import router from 'umi/router';

export default class SetBar extends Component {
    constructor(props) {
        super(props);
    }

    getClassName = (type) => {
        const {activePane} = this.props;
        return classNames(styles.btn, 'flex-v-coloum', activePane === type ? 'active' :  null);
    }

    render() {
        const {setGlobalState, saveMap, exportStyle, viewLink} = this.props;
        const btnClass = classNames(styles.btn, 'flex-v-coloum');
        return (
            <div className={classNames(styles.container, 'h100')}>
                <div className='flex-v-coloum mgb-2'>
                    <a href='http://www.atlasdata.cn' className={classNames(styles.logo, 'at-logo at-logo-white')}></a>
                </div>
                <div className={btnClass} onClick={() => { router.push('/map/list') }} title="返回">
                    <Icon icon="circle-arrow-left"  iconSize={22}  />
                </div>
                <div className={btnClass} title="保存" onClick={saveMap}>
                    <Icon icon="floppy-disk"  iconSize={22}  />
                </div>
                <Divider className={styles.divider} />
                <div className={this.getClassName('layer')} title="图层" onClick={() => { setGlobalState('activePane', 'layer') }}>
                    {/* <i className="iconfont">&#xe62b;</i><span>图层</span> */}
                    <Icon icon="layers"  iconSize={22}  />
                </div>
                {/* <div className={this.getClassName('basemap')} title="底图"  onClick={() => { setGlobalState('activePane', 'basemap') }}>
                    <Icon icon="globe"  iconSize={22}  />
                </div> */}
                <div className={this.getClassName('setting')} title="配置" onClick={() => { setGlobalState('activePane', 'setting') }}>
                    {/* <i className="iconfont">&#xe62b;</i><span>配置</span> */}
                    <Icon icon="settings"  iconSize={22}  />
                </div>
                <div className={btnClass} title="图标管理" onClick={() => { setGlobalState('showIconManage', true) }}>
                    {/* <i className="iconfont">&#xe62b;</i><span>图标</span> */}
                    <Icon icon="media"  iconSize={22}  />
                </div>
                <div className={this.getClassName('code')} title="代码" onClick={() => { setGlobalState('activePane', 'code') }}>
                    {/* <i className="iconfont">&#xe62b;</i><span>代码</span> */}
                    <Icon icon="code"  iconSize={22}  />
                </div>
                <Divider className={styles.divider} />
                <div className={btnClass} title="预览">
                    {/* <i className="iconfont">&#xe62b;</i><span>预览</span> */}
                    <a href={viewLink} target="_blank"><Icon icon="application"  iconSize={22}  /></a>
                </div>
                <div className={btnClass} title="分享" onClick={() => { setGlobalState('showShare', true) }}>
                    {/* <i className="iconfont">&#xe62b;</i><span>分享</span> */}
                    <Icon icon="share"  iconSize={22}  />
                </div>
                <div className={btnClass}  title="导出" onClick={exportStyle}>
                    {/* <i className="iconfont">&#xe62b;</i><span></span> */}
                    <Icon icon="export"  iconSize={22} />
                </div>
                {/* <div className={btnClass}><i className="iconfont">&#xe62b;</i><span>底图</span></div> */}
                {/* <div className={btnClass}><i className="iconfont">&#xe62b;</i><span>设置</span></div> */}
                <div className={styles.bottom}>
                    <div className={btnClass}  title="帮助">
                        <a href="http://www.atlasdata.cn/dev" target="_blank">
                            <Icon icon="help" iconSize={22} />
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}