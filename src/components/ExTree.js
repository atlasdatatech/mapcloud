import { Component } from 'react';
import classNames from 'classnames';
import styles from './Layer.less';
import { Tree } from "@blueprintjs/core";

export default class ExTree extends Tree {
    construtor(props) {
        super(props);
        this.state = {
            isDragging: false,
            dragSrouce: null,
        }
    }
}