import {Component} from 'react';
import classNames from 'classnames';
import styles from './index.less';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {setBodyHeight, isFullHeightBody, isHalfFullHeightBody} from '../utils/dom';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { Icon } from "@blueprintjs/core";
import Task from '../components/task/Task';
import {taskHelper} from '../utils/task';

import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";

@DragDropContext(HTML5Backend, /* optional */ { window })
class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
        if(window.PAGE_SPINNER) {
            window.PAGE_SPINNER.spin();
        }
        const {task, handles} = this.props;
        if((task && task.length > 0) || (handles && handles.length > 0)) {
            this.setState({showTask: true});
        }
    }

    getActiveNav = () => {
        const {location} = this.props;
        const {pathname} = location;
        if(pathname === '/map/list') return 'map';
        if(pathname === '/app/list') return 'app';
        if(pathname === '/ts/list') return 'tileset';
        if(pathname === '/dataset/list') return 'dataset';
        return '';
    }
    
    render() {
        const {children, location, task, handles, showTaskModal} = this.props;
        let mainHeight = 0;
        if(isFullHeightBody(location.pathname)) {
            setBodyHeight('100%');
            return (
                <div className={classNames('row free-width h100')}>{children}</div>
            )
        } else if(isHalfFullHeightBody(location.pathname)) {
            setBodyHeight('100%');
            mainHeight = 'calc(100% - 240px)';
        } else {
            setBodyHeight();
        }
        const widthClass = document.body.clientWidth < 1400 ? 'wide' : 'wider';
        const heightClass = mainHeight && document.body.clientHeight < 650 ? 'pt-2' : 'pt-4';
         
        return (
            <div className={classNames('row free-width at-layout-wrapper', mainHeight && 'h100')}>
                <div className={classNames('free-width at-header', styles.header)}>
                    <div className={classNames('wider h100')}>
                        <Header activeNav={this.getActiveNav()} />
                    </div>
                </div>
                <div className={classNames(widthClass, heightClass, styles.main)} style={{height: mainHeight || 'auto' }}>
                    {children}
                </div>
                <div className={classNames(widthClass, heightClass, styles.footer)}>
                    <Footer />
                </div>
                {
                    showTaskModal && <div className={styles.task}>
                        <Task task={task} handles={handles} />
                    </div>
                }
                {
                    !showTaskModal && <div className={classNames(styles.task, styles.miniTask)} 
                        onClick = {() => { taskHelper.showModal(true) }}
                        title="任务完成">
                    <div className="h100 flex-vertical-center">
                        <Icon icon="time" iconSize={22} />
                    </div>
                    {task.length > 0 && 
                        <div className={styles.taskTotal}>
                            <span>{task.length}</span>
                        </div>
                    }
                </div>
                }
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
      task: state.task.task || [],
      handles: state.task.handles || [],
      showTaskModal: state.task.showModal
    };
}

// 使用浏览器返回，页面没有刷新，使用widthRouter外包一下
// export default withRouter(connect(({}) => ({}))(Layout))
export default withRouter(connect(mapStateToProps)(Layout));