import Scrollbar from 'perfect-scrollbar-react';
import styles from './ScrollWrapper.less';
import classNames from 'classnames';

export default function FixScrollBar(props) {
    return (
        <div className={classNames(styles.scrollwrapper, props.className)}>
            <Scrollbar options={props.options}>
                {props.children}
            </Scrollbar>
        </div>
    );
  }