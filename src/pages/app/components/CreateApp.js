import { Component } from 'react';
import Modal from '../../../components/modals/BaseModal';
import BlankCreate from '../../../components/BlankCreate';
import classNames from 'classnames';
import styles from './CreateApp.less';
import ScrollWrapper from '../../../components/ScrollWrapper';
import { Button, Card, Elevation  } from "@blueprintjs/core";


export default class CreateSApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templates: [
                {id:'123', title:'TEST-TPL', thumbnail:'', url:'', desc: 'TEST-DECRIPTIONTEST-DECRIPTIONTEST-DECRIPTION'},
            ],
        }
    }

    handleCreate = () => {
        const {handleCreateAppModal} = this.props;
        handleCreateAppModal(true);
    }

    handleSelected = (item) => {
        this.cancel();
    }

    cancel = () => {
        const {
            handleCreateAppModal,
        } = this.props;
        handleCreateAppModal(false);
    }

    render() {
        const {
            openCreateAppModal, 
        } = this.props;
        const {templates} = this.state;
        return (
            <Modal className={styles.modal} title='创建应用 - 选择模板' isOpen={openCreateAppModal} 
                icon={<i className="iconfont">&#xe62b;</i>}
                confirm = {false}
                handleClose = {this.cancel}>
                <div className={styles.content}>
                    <ScrollWrapper className={styles.wrapper}>
                        {/* <p className={styles.note}>共{templates.length}个模板，请选择模板以便创建地图：</p> */}
                        <ul className={classNames(styles.list)}>
                            {templates.map((t, index) => {
                                return (
                                    <li key={index} className='at-card-wrapper'>
                                    <Card interactive={true} elevation={Elevation.ONE}>
                                        <div className={classNames('at-card-content', styles.item)}>
                                            <div className='at-bg-light'>
                                                <img src={t.thumbnail || './images/thumbnail.svg'} />
                                            </div>
                                            <h5>{t.title}
                                                <Button intent="primary" onClick={() => {this.handleSelected(t)}}>创建</Button>
                                            </h5>
                                            <p>{t.desc}</p>
                                        </div>
                                        </Card>
                                    </li>
                                    );
                            })}
                        </ul>
                        {
                            templates.length === 0 && <BlankCreate desc="还没有地图模板" />
                        }
                    </ScrollWrapper>
                </div>
            </Modal>
        )
    }
}