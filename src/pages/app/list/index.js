// 我的应用 + 公开的应用
import { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import layoutStyles from '../../../styles/common/mainLayout.less';
import {HelpListComponent} from '../../../components/Help';
import { ButtonGroup, Button, Card, Elevation } from "@blueprintjs/core";
import BlankCreate from '../../../components/BlankCreate';
import CreateAppModal from '../components/CreateApp';

export default class AppList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openCreateAppModal: false,
            apps: [
                // {id:'1231', title:'TEST-APP', url:'', createTime:'2019-02-12 12:12:12', updateTime: '2019-02-12 12:12:12', tag: '默认分类', thumbnail:''},
                // {id:'1231', title:'TEST-APP', url:'', createTime:'2019-02-12 12:12:12', updateTime: '2019-02-12 12:12:12', tag: '默认分类', thumbnail:''},
                // {id:'1231', title:'TEST-APP', url:'', createTime:'2019-02-12 12:12:12', updateTime: '2019-02-12 12:12:12', tag: '默认分类', thumbnail:''},
                // {id:'1231', title:'TEST-APP', url:'', createTime:'2019-02-12 12:12:12', updateTime: '2019-02-12 12:12:12', tag: '默认分类', thumbnail:''},
                // {id:'1231', title:'TEST-APP', url:'', createTime:'2019-02-12 12:12:12', updateTime: '2019-02-12 12:12:12', tag: '默认分类', thumbnail:''},
                {id:'1231', title:'TEST-APP', url:'', createTime:'2019-02-12 12:12:12', updateTime: '2019-02-12 12:12:12', tag: '默认分类', thumbnail:''},
            ]
        }
    }

    handleCreateAppModal = (state) => {
        this.setState({openCreateAppModal: state});
    }

    render() {
        const {apps, openCreateAppModal} = this.state;
        return (
            <div className="clearfix">
                <div className={classNames(layoutStyles.main)}>
                <div className="mgb-8">
                        <div className={classNames("row")}>
                            <div className="columns six"><h3><i className="iconfont">&#xe62b;</i> 我的应用 </h3></div>
                            <div className="columns six text-right"></div>
                        </div>
                        <div className={classNames(styles.mapForm, "row")}>
                            <div className="columns three">
                                <div className="bp3-input-group">
                                    <input type="text" className="bp3-input" placeholder="输入关键字" />
                                    <button className="bp3-button bp3-minimal"><i className="iconfont">&#xe62b;</i></button>
                                </div>
                            </div>
                            <div className="columns three text-center">
                                <label className="bp3-label bp3-inline">
                                    分类标签
                                    <div className="bp3-select">
                                        <select>
                                            <option defaultValue="all">全部</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                            <option value="4">Four</option>
                                        </select>
                                    </div>
                                </label>
                            </div>
                            <div className="columns four">
                                <label className="bp3-label bp3-inline">
                                    排序
                                    <div className="bp3-select">
                                        <select>
                                            <option defaultValue="createTime">更新时间</option>
                                            <option value="4">名称</option>
                                        </select>
                                    </div>
                                    <button type="button" className="bp3-button bp3-minimal" style={{marginLeft: '5px'}}>
                                        <i className="iconfont">&#xe62b;</i>
                                    </button>
                                    <button type="button" className="bp3-button bp3-minimal">
                                        <i className="iconfont">&#xe62b;</i> 
                                    </button>
                                </label>
                            </div>
                            <div className="columns two pd0">
                                <Button intent="primary" fill="true" large="true"
                                    onClick = {() => {this.handleCreateAppModal(true)}}
                                    className={styles.createButton}>
                                    <i className="iconfont">&#xe62b;</i> 创建应用
                                </Button>
                            </div>
                        </div>
                        <div className="pt-2">
                            <ul className={classNames(styles.list, 'at-map-list')}>
                                {apps.map((map, index) => {
                                    return (
                                        <li key={index} className='at-card-wrapper'>
                                            <Card interactive={true} elevation={Elevation.ONE}>
                                                <div className={classNames('at-card-content', styles.item)}>
                                                    <div className='at-bg-light'><img src={map.thumbnail || './images/thumbnail.svg'} /></div>
                                                    <h5>{map.title}</h5>
                                                    <p><i className="iconfont">&#xe62b;</i> {map.tag}</p>
                                                    <p><i className="iconfont">&#xe62b;</i> {map.updateTime}</p>
                                                    <div className="text-right">
                                                        <ButtonGroup minimal={true}>
                                                            <Button><i className="iconfont">&#xe62b;</i></Button>
                                                            <Button><i className="iconfont">&#xe62b;</i></Button>
                                                            <Button><i className="iconfont">&#xe62b;</i></Button>
                                                            <Button><i className="iconfont">&#xe62b;</i></Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </div>
                                            </Card>
                                        </li>
                                    )
                                })}
                            </ul>
                            {
                                apps.length === 0  && <BlankCreate desc="您还没有应用，赶快创建一个吧" />
                            }
                        </div>
                    </div>
                </div>
                <div className={classNames(layoutStyles.side, 'pd-2 at-side')}>
                    <Card interactive={true} elevation={Elevation.THREE}>
                        <HelpListComponent type='APP' />
                    </Card>
                </div>

                <CreateAppModal 
                    handleCreateAppModal = {this.handleCreateAppModal}
                    openCreateAppModal = {openCreateAppModal} />
            </div>
        )
    }

};