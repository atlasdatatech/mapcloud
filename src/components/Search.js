import { Component } from "react";
import styles from './Search.less';
import classNames from 'classnames';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            result: [],
            showResultPane: false,
        }
    }

    query = () => {
        // console.log('query');
        this.setState({showResultPane: true});
    }

    remove = () => {
        this.setState({keyword: '', result: [], showResultPane: false});
    }

    render() {
        const {keyword, result, showResultPane} = this.state;
        return (
          <div className={styles.searchWrap}>
              <input type="text" placeholder="请输入关键词" maxLength="40" 
              value={keyword}
              onChange={(e) => { this.setState({keyword: e.target.value});setTimeout(() => { this.query(); }, 100); }} />
              <button className={styles.btnRemove} onClick={this.remove} title='清空搜索结果'><i className="icon iconfont">&#xe8b6;</i></button>
              <button className={styles.btnQuery} onClick={() => {this.query(true)}} title='搜索'><i className="icon iconfont">&#xe60c;</i></button>
              <div className={styles.result} style={{display: showResultPane ? 'block' : 'none' }}>
                <ul>
                    {showResultPane && result.map((item, index) => {
                        return <li key={index} onClick={() => {this.locate(item)}}><i className="icon iconfont">&#xe60c;</i> {item['名称']||item['name']}</li>
                    })}
                    {showResultPane && (!result||!result.length) && <div>
                        共找到0个搜索结果， 您可以检查输入是否正确或者输入其它词
                        </div>}
                </ul>
              </div>
          </div>
        );
    }
}