import {Component} from 'react';
import classNames from 'classnames';
import styles from './index.less';
import ScrollWrapper from '../../../components/ScrollWrapper';
import { ButtonGroup, Button, Card, Elevation } from "@blueprintjs/core";
import {loadAtlasByInspector} from '../../../utils/load';
import Local from '../../../utils/local';
import {ajax_get, ajax_post} from '../../../utils/ajax';
import dayjs from 'dayjs';
import DeleteAlert from '../../../components/modals/DeleteModal';
import router from 'umi/router';
import Toaster from '../../../components/Toaster';
import BlankCreate from '../../../components/BlankCreate';
import { detailMap } from '../../../map/detail';


export default class TilesetDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tileset: null,
            showDelete: false,
            showBlank: false,
            url: '',
            layers: []
        }
        this.mapPane = React.createRef();
        this.map = null;
    }

    initMap = () => {
        if(!this.mapPane.current) return;
        window.mapboxgl = atlas;
        this.map = detailMap({
            container: this.mapPane.current,
            url: this.state.url,
            tileset: this.state.tileset,
            updateState: ({layers}) => { 
                this.setState({layers});
            }
        });
    }

    getBBox() {
        const {tileset} = this.state;
        if(!tileset) return '';
        const {bbox} = tileset;
        if(!bbox) return '';
        const {Min, Max} = bbox;
        if(!Min || !Max) return '';
        return <div><p>{Min[0]}, {Min[1]}</p><p>{Max[0]}, {Max[1]}</p></div>;
    }

    deleteHandler = () => {
        const {tileset} = this.state;
        const user = Local.get('name');
        ajax_post({
            url:`ts/delete/${tileset.id}/`, 
        }).then((res) => {
            if(res && res.code === 200) {
                this.setState({tileset: null});
                router.push('/ts/list');
            }
            this.setState({showDelete: false});
        }); 
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.setState({url: `ts/x/${id}/`});
        ajax_get({
            url:`ts/x/${id}/`, 
        }).then((res) => {
            if(res) {
                this.setState({ tileset: res });
                loadAtlasByInspector(this.initMap);
            } else {
                this.setState({showBlank: true});
                Toaster.show({message: '服务集文件请求失败', intent: 'warning', icon:'error', timeout: 2000});
                setTimeout(() => {
                    router.push('/ts/list')
                }, 3000);
            }
        });
    }

    componentWillUnmount() {
        if(this.map) {
            this.map.remove();
            this.map = null;
        }
    }

    render() {
        const {tileset, showBlank, layers} = this.state;
        if(showBlank) return  <BlankCreate desc='未找到相应的服务集，即将跳转到服务集列表' className='mgt-6' />;
        if(!tileset) return null;
        return (
            <div className={classNames(styles.main, 'h100 clear')}>
                <div className="pd-1 h100">
                    <Card elevation={Elevation.TWO} className={classNames(styles.card, 'h100')}>
                        <h2 className='pr-3 mgb-2 text-overflow'>{tileset.name || tileset.id}</h2>
                        <div className='pr-3 mgb-2'>
                            <ButtonGroup>
                                <Button icon='trash' text='删除' 
                                onClick={() => {this.setState({showDelete: true})}}></Button>
                            </ButtonGroup>
                        </div>
                        <ScrollWrapper className={styles.scroll} options={{suppressScrollX : true}}>
                            <table className={classNames(styles.table, 'mgb-2')}>
                                <tbody>
                                    <tr><td>ID</td></tr>
                                    <tr><td>{tileset.id}</td></tr>
                                    <tr><td>格式</td></tr>
                                    <tr><td>{tileset.format}</td></tr>
                                    {tileset.bounds && <tr><td>Bounds</td></tr>}
                                    {tileset.bounds && <tr><td>{ tileset.bounds.join(' , ')}</td></tr>}
                                    {tileset.center && <tr><td>中心点</td></tr>}
                                    {tileset.center && <tr><td>{tileset.center && tileset.center.slice(0,2).join(', ')}</td></tr>}
                                    <tr><td>最小层级</td></tr>
                                    <tr><td>{tileset.minzoom}</td></tr>
                                    <tr><td>最大层级</td></tr>
                                    <tr><td>{tileset.maxzoom}</td></tr>
                                    <tr><td>更新时间</td></tr>
                                    <tr><td>{dayjs(tileset.updated_at).format('YYYY-MM-DD HH:MM')}</td></tr>
                                </tbody>
                            </table>
                            {
                                layers && layers.length > 0 && <h5 className='mgb-2'>图层列表 ({layers.length})</h5>
                            }
                            <ul className={styles.layers}>
                                {layers.map((layer, index) => {
                                    return (
                                        <li key={index}>
                                            <span style={{backgroundColor: layer.color}}></span> {layer.id}
                                        </li>
                                    )
                                })}
                            </ul>
                        </ScrollWrapper>
                    </Card>
                </div>
                <div className="pd-1 h100">
                    <div ref={this.mapPane} className={classNames(styles.map, 'h100 fill-canvas')}></div>
                </div>
                <DeleteAlert 
                    isOpen={this.state.showDelete} 
                    desc='确定要删除此服务集吗？删除后将无法恢复，并影响关联的地图与应用'
                    cancelHandler={() => {this.setState({showDelete: false})}}
                    confirmHandler = {this.deleteHandler}
                 />
            </div>
        )
    }
}