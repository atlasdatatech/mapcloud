import styles from './Help.less';
import classNames from 'classnames';
import { Divider} from "@blueprintjs/core";
import {IconText} from './common';
import {getDevLink} from '../utils/link';

const HelpMap = {
    MAP: {
        name: '地图',
        listTitle: '地图指南',
        list: [
            { title: '地图云快速上手', link: 'guide/5' },
            { title: '创建地图', link: 'guide/create-map' },
            { title: '地图编辑', link: 'guide/edit-map' },
            { title: '地图分享', link: 'guide/share-map' },
        ],
        questionTitle: '地图常见问题',
        questions: [
            { title: '地图创建有限制吗？', link: 'question/q-4-1' },
            { title: '地图样式可以下载吗？', link: 'question/q-4-2' },
            { title: '能进行二次开发吗？', link: 'question/q-4-3' },
            { title: '地图可以在手机中浏览吗？', link: 'question/q-4-4' },
        ]
    },
    DATASET: {
        name: '数据集',
        listTitle: '数据集指南',
        list: [
            { title: '地图云快速上手', link: 'guide/5' },
            { title: '数据集概念', link: 'guide/dataset' },
            { title: '数据集上传', link: 'guide/upload-dataset' },
            { title: '数据集管理', link: 'guide/use-dataset' },
        ],
        questionTitle: '数据集常见问题',
        questions: [
            { title: '数据上传大小限制吗？', link: 'question/q-6-1' },
            { title: '数据集、服务集有什么区别？', link: 'question/q-5-1' },
            { title: '数据集上传失败怎么办？', link: 'question/q-6-2' },
            { title: '数据集中有乱码怎么处理？', link: 'question/q-6-3' },
        ]
    },
    TILESET: {
        name: '服务集',
        listTitle: '服务集指南',
        list: [
            { title: '地图云快速上手', link: 'guide/5' },
            { title: '服务集概念', link: 'guide/ts' },
            { title: '服务集上传', link: 'guide/upload-ts' },
            { title: '服务集管理', link: 'guide/use-ts' },
        ],
        questionTitle: '服务集常见问题',
        questions: [
            { title: '数据集、服务集有什么区别？', link: 'question/q-5-1' },
            { title: '服务集的大小有限制吗？', link: 'question/q-5-2' },
            { title: '服务集上传失败怎么办？', link: 'question/q-5-3' },
            { title: '服务集为什么有乱码？', link: 'question/q-5-4' },
        ]
    }, 
    APP: {
        name: '应用',
        listTitle: '应用指南',
        list: [
            { title: '地图云快速上手', link: 'guide/5' },
            { title: '应用发布教程', link: '' },
            { title: '应用编辑教程', link: '' },
            { title: '应用使用教程', link: '' },
            { title: '应用分享教程', link: '' },
        ],
        questionTitle: '应用常见问题',
        questions: [
            { title: '能定制不同的应用吗？', link: '' },
            { title: '数据集、服务集有什么区别？', link: '' },
            { title: '能进行二次开发吗？', link: '' },
            { title: '地图可以在手机中应用吗？', link: '' },
        ]
    },
    ACCOUNT: {
        name: '用户',
        listTitle: '用户指南',
        list: [
            // { title: '地图云快速上手', link: '' },
            // { title: '上传数据', link: '' },
            // { title: '创建地图', link: '' },
            // { title: '创建应用', link: '' },
            // { title: '地图云个人主页介绍', link: '' },
        ],
        questionTitle: '用户常见问题',
        questions: [
            { title: '如何修改密码？', link: '' },
            { title: '如何修改帐户资料？', link: '' },
            { title: '如何退出地图云？', link: '' },
        ]
    }
}

export const HelpListComponent = (props) => {
    let target = HelpMap[props.type.toUpperCase()];
    const {list, questionTitle, questions, listTitle} = target;
    return (
        <div className={classNames(styles.help, "at-help at-a-normal")}>
            {
                list.length > 0 && <div>
                    <h5><IconText icon="git-repo" text={listTitle} /></h5>
                    <ul>
                        {list.map((q, index) => {
                            return (
                                <li key={index}><a href={getDevLink(q.link) || 'javascript:;'} target="_blank">{q.title}</a></li>
                            )
                        })}
                    </ul>
                    <Divider className='mgb-3 mgt-3' />
                </div>
            }
            {
                questions.length > 0 && <div>
                    <h5><IconText icon="help" text={questionTitle} /></h5>
                    <ul>
                        {questions.map((q, index) => {
                            return (
                                <li key={index}><a href={getDevLink(q.link) || 'javascript:;'} target="_blank">{q.title}</a></li>
                            )
                        })}
                    </ul>
                    <Divider className='mgb-3 mgt-3' />
                </div>
            }
            <h5><IconText icon="comment" text={'技术支持'} /></h5>
            <p>官方QQ群：673450783</p>
            <p>咨询QQ：3537159216</p>
            <p>咨询电话：177-1421-1819</p>
            <p>Email：<a href="mailto:service@atlasdata.cn">service@atlasdata.cn</a></p>
        </div>
    );
}