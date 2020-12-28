import { Component } from 'react';
import Modal from '../../../components/modals/BaseModal';
import BlankCreate from '../../../components/BlankCreate';
import classNames from 'classnames';
import styles from './CreateTilesetByExsitDataset.less';
import ScrollWrapper from '../../../components/ScrollWrapper';
import { Button, Card, Elevation, Icon, Spinner } from "@blueprintjs/core";
import dayjs from 'dayjs';
import { superbytes } from '../../../utils/file';
import { ajax_post } from '../../../utils/ajax';
import Toaster from '../../../components/Toaster';
import Local from '../../../utils/local';

export default class CreateTilesetByExsitDataset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectId: null,
            publishing: false,
        }
    }

    handleCreate = () => {
        const {selectId} = this.state;
        if(!selectId) return;
        this.setState({publishing: true});
        const user = Local.get('name');
        ajax_post({url: `ts/create/${selectId}/`}).then((res) => {
            if(res && res.code === 200) {
                this.cancel();
                Toaster.show({message:'发布成功', intent:'success', icon:'tick-circle'});
                const {handleCreateTilesetByExistDatasetModal, updateHandler} = this.props;
                handleCreateTilesetByExistDatasetModal(false);
                setTimeout(updateHandler, 1000);
            } else {
                Toaster.show({message: res.msg || '发布失败', intent:'danger', icon:'error'});
            }
        });
    }

    handleSelected = (item) => {
        const {publishing} = this.state;
        if(!publishing) {
            this.setState({selectId: item.id});
        }
    }

    cancel = () => {
        const {
            handleCreateTilesetByExistDatasetModal,
        } = this.props;
        handleCreateTilesetByExistDatasetModal(false);
        this.setState({selectId: null, publishing: false});
    }

    render() {
        const {
            openCreateTilesetByExistDatasetModal, 
            datasets
        } = this.props;
        const {selectId, publishing} = this.state;
        return (
            <Modal className={styles.modal} 
                title='创建服务集 - 选择已有数据集' 
                isOpen={openCreateTilesetByExistDatasetModal} 
                icon='cloud-upload'
                okDisabled = {!selectId || publishing}
                handleOk = {this.handleCreate}
                handleClose = {this.cancel}>
                <div className={styles.content}>
                    <ScrollWrapper className={styles.wrapper}>
                        {/* <p className={styles.note}>共{templates.length}个模板，请选择模板以便创建地图：</p> */}
                        <ul className={classNames(styles.list, 'at-map-list2')}>
                            {datasets && datasets.map((t, index) => {
                                return (
                                    <li key={index} onClick={() => {this.handleSelected(t, index)}}>
                                        <Card interactive={true} elevation={Elevation.ONE} 
                                            className={classNames('at-box-select', selectId === t.id ? 'at-box-selected' : null)}>
                                            <div className={classNames(styles.item, 'flex-vertical')}>
                                            <div>
                                                {publishing && selectId === t.id && <Spinner size={46} intent='success' />}
                                                {(!publishing || (publishing && selectId !== t.id)) && <img src={t.thumbnail || './images/thumbnail.svg'} />}
                                            </div>
                                            <div>
                                                <h5>{t.name}</h5>
                                                <p><Icon icon='time' /> {dayjs(t.updated_at).format('YYYY-MM-DD HH:MM')}</p>
                                            </div>
                                            </div>
                                        </Card>
                                    </li>
                                    );
                            })}
                        </ul>
                        {
                            datasets.length === 0  && <BlankCreate desc="您还没有数据集" />
                        }
                        {
                            publishing && <p className="pd-2 text-align">正在发布中...请稍候，您可以关掉窗口，不影响发布结果</p>
                        }
                    </ScrollWrapper>
                </div>
            </Modal>
        )
    }
}