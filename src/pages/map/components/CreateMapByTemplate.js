import { Component } from 'react';
import Modal from '../../../components/modals/BaseModal';
import BlankCreate from '../../../components/BlankCreate';
import classNames from 'classnames';
import styles from './CreateMapByTemplate.less';
import ScrollWrapper from '../../../components/ScrollWrapper';
import { Button, Card, Elevation  } from "@blueprintjs/core";
import {ajax_get} from '../../../utils/ajax';
import router from 'umi/router';


export default class CreateMapByTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleCreate = () => {
        const {handleCreateMapByTemplateModal} = this.props;
        handleCreateMapByTemplateModal(true);
    }

    handleSelected = (item) => {
        if(!item) return;
        ajax_get({url: `maps/clone/${item.id}/`}).then((res) => {
            if(res && res.code === 200 && res.data) {
                this.cancel();
                router.push(`/map/edit/${res.data.id}?type=clone`);
            } else {
                Toaster.show({message: res.msg, icon:'error', intent:'danger'});
            }
        })
    }

    cancel = () => {
        const {
            handleCreateMapByTemplateModal,
        } = this.props;
        handleCreateMapByTemplateModal(false);
    }

    render() {
        const {
            openCreateMapByTemplateModal, templates
        } = this.props;
        return (
            <Modal className={styles.modal} title='创建地图 - 选择模板创建' isOpen={openCreateMapByTemplateModal} 
                icon={<i className="iconfont">&#xe62b;</i>}
                confirm = {false}
                handleClose = {this.cancel}>
                <div className={styles.content}>
                    <ScrollWrapper className={styles.wrapper}>
                        <ul className={classNames(styles.list)}>
                            {templates.map((t, index) => {
                                return (
                                    <li key={index} className='at-card-wrapper'>
                                    <Card interactive={true} elevation={Elevation.ONE}>
                                        <div className={classNames('at-card-content', styles.item)}>
                                            <div className='at-bg-light'>
                                                <img src={t.thumbnail || './images/thumbnail.svg'} />
                                            </div>
                                            <h5>{t.name}
                                                <Button intent="primary" onClick={() => {this.handleSelected(t)}}>创建</Button>
                                            </h5>
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