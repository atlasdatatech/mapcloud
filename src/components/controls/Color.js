import { Component } from 'react';
import classNames from 'classnames';
import styles from './Color.less';
import Color from 'color';
import ChromePicker from 'react-color/lib/components/chrome/Chrome';
import { Popover } from "@blueprintjs/core";

function formatColor(color) {
    const rgb = color.rgb;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
}

export default class ColorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickOpen: false,
        }
    }

    getColor = () => {
        try {
            return Color(this.props.value).rgb()
        } catch(err) {
            return Color("rgb(255,255,255)");
        }
    }

    togglePicker = () => {
        this.setState({pickOpen: !this.state.pickOpen});
    }

    render() {
        const {width, height, onChange, value, className, style, position} = this.props;
        const _color = this.getColor();
        const currentColor = {
            r: _color.color[0],
            g: _color.color[1],
            b: _color.color[2],
            a: _color.valpha
          };
        //   console.log(currentColor)
        const picker = <div className={styles.picker}><ChromePicker color={currentColor} 
            onChange={c => onChange(formatColor(c))} />
            </div>
        return (
            <div className={className}>
                <Popover content={picker} position={position||'right'}>
                <div onClick={this.togglePicker} 
                    style={{width: `${width||30}px`, 
                        height: `${height||20}px`, 
                        cursor: 'pointer',
                        border: '4px solid #fff', 
                        boxShadow: '0 0 0 1px rgba(0,0,0,.2)',
                        backgroundColor:value, ...style}} title={'拾取颜色'}></div>
                </Popover>
            </div>
        )
    }
}