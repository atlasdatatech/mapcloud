import { Component } from 'react';
import classNames from 'classnames';
import styles from './Header.less';
import { Popover, Position, Divider, Icon } from "@blueprintjs/core";
import {setRouter, ROUTES} from '../utils/router';
import { ajax_post } from '../utils/ajax';
import Toaster from './Toaster';
import Local from '../utils/local';
import {IconText} from './common';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userMenuOpen: false,
            openPasswordModal: false,
        }
    }

    switchUserMenu = () => {
        const {userMenuOpen} = this.state;
        this.setState({userMenuOpen: !userMenuOpen});
    }

    switchNav = ({pathname}) => {
        setRouter(pathname);
    }

    handleOpenPasswordModal = (state) => {
        this.setState({openPasswordModal: state})
    }

    logout = () =>{
        ajax_post({
            url: 'account/signout/',
        }).then((res) => {
            if(res && res.code === 200) {
                Local.clear();
                location.href = './login.html';
            } else {
                Toaster.show({message:'退出错误' + (res.msg || ''), intent:'error', icon:'error'});
            }
        })
    }

    render() {
        const { userMenuOpen } = this.state;
        const {activeNav} = this.props;
        let UserMenu = (
            <div className={classNames(styles.userMenuList, 'pd-2 at-user-menu')}>
                <ul>
                    <li>{Local.get('name') || '未登录用户'}, 您好！</li>
                    <li onClick={() => setRouter({ pathname:ROUTES.ACCOUNT })}>
                        <IconText icon="user" text="我的帐户" />
                    </li>
                    <li onClick={() => setRouter({ pathname:ROUTES.TOKEN })}>
                        <IconText icon="key" text="访问密钥" />
                    </li>
                    <li><IconText icon="help" text="帮助中心" /></li>
                    <Divider />
                    <li onClick={this.logout}>
                        <IconText icon="log-out" text="退出" />
                    </li>
                </ul>
            </div>
        );
        return (
            <div className={classNames('row pd0 h100', styles.header)}>
                <div className={classNames('columns four pd0 h100 at-cloud-logo', styles.logo)}>
                    <a href="/"><h1></h1></a>
                </div>
                <div className={classNames('columns seven pd0 h100 at-nav', styles.nav)}>
                    {/* <a href="javascript:;" onClick={() => setRouter({pathname:ROUTES.APP_LIST})} 
                        className={activeNav === 'app' ? 'active' : null}>
                        <i className="iconfont">&#xe62b;</i> 应用
                    </a> */}
                    <a href="javascript:;" onClick={() => setRouter({pathname:ROUTES.MAP_LIST})} 
                        className={activeNav === 'map' ? 'active' : null}>
                        <Icon icon="map" iconSize={20} /> <span>地图</span>
                    </a>
                    <a href="javascript:;" onClick={() => setRouter({pathname:ROUTES.TILESET_LIST})} 
                        className={activeNav === 'tileset' ? 'active' : null}>
                        <Icon icon="box" iconSize={20} /> <span>服务集</span>
                    </a>
                    <a href="javascript:;" onClick={() => setRouter({pathname:ROUTES.DATASET_LIST})} 
                        className={activeNav === 'dataset' ? 'active' : null}>
                        <Icon icon="database" iconSize={20} /> <span>数据集</span>
                    </a>
                </div>
                <div className={classNames('columns one pd0 h100', styles.userMenu)} onClick={this.switchUserMenu}>
                    <Popover content={UserMenu} position={Position.BOTTOM} isOpen={userMenuOpen}>
                        <span className={classNames(styles.userLogo, 'disable-user-select at-user-logo')}>
                            <i className="iconfont">&#xe650;</i>
                        </span>
                    </Popover>
                    <i className={classNames('at-arrow at-arrow-down', styles.arrow)}></i>
                </div>
                {/* <Password openPasswordModal={openPasswordModal} handleOpenPasswordModal={this.handleOpenPasswordModal} /> */}
            </div>
        );
    }
}