import {Component} from 'react';
import PropTypes from 'prop-types';

const ENTER_KEY_CODE = 13;
const ESCAPE_KEY_CODE = 27;
const DEFAULT_LABEL_PLACEHOLDER = "";

export default class Editable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editZone: props.editZone,
            text: props.text || "",
            originalText: props.text || "",
            validateOnEnterKey: props.validateOnEnterKey || (props.editZone === undefined),
            cancelOnEscapeKey: props.cancelOnEscapeKey || (props.editZone === undefined),
            isEditable: props.isEditable != false,
        	isEditing: props.isEditing || false,
            isOver: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            editZone: nextProps.editZone,
            text: nextProps.text || "",
            validateOnEnterKey: nextProps.validateOnEnterKey || (nextProps.editZone === undefined),
            cancelOnEscapeKey: nextProps.cancelOnEscapeKey || (nextProps.editZone === undefined),
            isEditable: nextProps.isEditable != false,
            isEditing: this.state.isEditing || nextProps.isEditing || false
        });
    }

    _isTextValueValid = () => {
        // return (typeof this.state.text != "undefined" && this.state.text.trim().length > 0);
        return true;
    }

    _handleFocus = () => {
        const {onFocusOut} = this.props;
        if (this.state.isEditing) {
            if (typeof onFocusOut === 'function') {
                onFocusOut(this.state.text);
            }
        }
        else if (typeof this.props.onFocus === 'function') {
            this.props.onFocus(this.state.text);
        }

        var isEditing;

        if (this._isTextValueValid()) {
            isEditing = !this.state.isEditing;
        }
        else if (this.state.isEditing) {
            isEditing = this.props.emptyEdit || false;
        }
        else {
            isEditing = true;
        }

        if (!this.state.isEditing && isEditing) {
            this.setState({
                originalText: this.state.text
            });

            document.addEventListener('mousedown', this._handleClickOutside);
        }

        this.setState({
            isEditing: isEditing
        });
    }

    _handleClickOutside = (e) => {
        if (this.editZone && !this.editZone.contains(e.target)) {
            document.removeEventListener('mousedown', this._handleClickOutside);
            this._handleFocus();
        }
    }

    onChange = (text) => {
        if (this.props.onChange) {
            this.props.onChange(text);
        }
        else {
            this.setState({
                text: text
            });
        }
    }

    _handleChange = (e) => {
        this.onChange(e.target.value);
    }

    _handleKeyDown = (e) => {
        if (this.state.validateOnEnterKey && e.keyCode === ENTER_KEY_CODE) {
            this._handleEnterKey();
        }
        else if (this.state.cancelOnEscapeKey && e.keyCode === ESCAPE_KEY_CODE) {
            this._handleEscapeKey();
        }
    }

    _handleEnterKey = () => {
        this.setState({
            originalText: this.state.text
        });

        this._handleFocus();
    }

    _handleEscapeKey = () => {
        this.setState({
            text: this.state.originalText
        });

        this.onChange(this.state.originalText);
        this._handleFocus();
    }

    _refEditZone = (element) => {
      this.editZone = element;
    };

    _getEditZone = (text) => {
        if (this.state.editZone) {
            var editZone;

            if (typeof this.state.editZone === 'function') {
                editZone = this.state.editZone(text);
            }
            else {
                editZone = this.state.editZone;
            }

            return (
                <span
                    onMouseOut={() => this.setState({ isOver: false })}
                    ref={(ref) => { this.editZone = ref }}
                >
                    { editZone }
                </span>
            );
        }
        else {
            return (
                <input type="text"
                    value={ text }
                    onMouseOut={() => this.setState({ isOver: false })}
                    onChange={ this._handleChange }
                    onBlur={ this._handleFocus }
                    onKeyDown={ this._handleKeyDown }
                    ref={(ref) => { this.editZone = ref }}
                    autoFocus
                />
            );
        }
    }

    _getNormalZone = (text) => {
        const zone = this.props.children || text;
        var style = this.state.isEditable ? {
            cursor: 'pointer',
        } : {};

        if (typeof zone !== 'string') {
            style.display = 'inherit';
        }

        if (this.state.isEditable) {
            const props = {
                className: this.props.className,
                onMouseOver: () => { this.state.isEditable && this.setState({ isOver: true }) },
                onMouseOut: () => { this.setState({ isOver: false }) },
                onClick: this._handleFocus,
                style: style
            };

            return (
                <span
                    { ...props }
                    >
                    { zone }
                </span>
            );
        }
        else {
            return zone;
        }
    }

    render() {
    	if (this.state.isEditable && this.state.isEditing) {
            return this._getEditZone(this.state.text);
        }
        else {
            const text = this._isTextValueValid() ? this.state.text : (this.props.labelPlaceHolder || DEFAULT_LABEL_PLACEHOLDER);

            return this._getNormalZone(text);
        }
    }
}

Editable.propTypes = {
    text: PropTypes.string,
    isEditing: PropTypes.bool,
    isEditable: PropTypes.bool,
    emptyEdit: PropTypes.bool,
    validateOnEnterKey: PropTypes.bool,
    cancelOnEscapeKey: PropTypes.bool,
    labelPlaceHolder: PropTypes.string,

    labelClassName: PropTypes.string,
    labelFontSize: PropTypes.string,
    labelFontWeight: PropTypes.string,

    inputMaxLength: PropTypes.number,
    inputPlaceHolder: PropTypes.string,
    inputTabIndex: PropTypes.number,
    inputWidth: PropTypes.string,
    inputHeight: PropTypes.string,
    inputFontSize: PropTypes.string,
    inputFontWeight: PropTypes.string,
    inputClassName: PropTypes.string,
    inputBorderWidth: PropTypes.string,

    onFocus: PropTypes.func,
    onFocusOut: PropTypes.func
};