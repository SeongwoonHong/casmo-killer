import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './TextButton.scss';

class TextButton extends Component {
  render() {
    const loader = (
      <div className="loader" />
    );
    return (
      <button
        id={this.props.id}
        className={classnames('btn blue', this.props.className)}
        type={this.props.type}
        role={this.props.role}
        style={this.props.style}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
        disabled={this.props.disabled}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        { this.props.isLoading ? loader : this.props.children }
      </button>
    );
  }
}

TextButton.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  role: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};
TextButton.defaultProps = {
  id: '',
  className: 'class',
  role: 'presentation',
  type: '',
  disabled: false,
  isLoading: false,
  style: {},
  onClick: () => {},
  onKeyDown: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {}
};
export default TextButton;
