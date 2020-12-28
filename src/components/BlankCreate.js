import styles from './BlankCreate.less';
import classNames from 'classnames';

export default (props) => {
    const {desc} = props;
    return (
        <div className={classNames(styles.blankCreate, 'pt-5 pb-5 at-create-blank', props.className)} style={props.style}>
            <div></div>
            <div>{desc}</div>
            {props.children}
        </div>
    )
}