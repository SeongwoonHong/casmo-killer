import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './IconButton.scss';

class IconButton extends Component {
  render() {
    return (
      <img
        id={this.props.id}
        className={classnames('btn', this.props.className)}
        style={this.props.style}
        src={this.props.src}
        alt={this.props.alt}
        href={this.props.href}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

IconButton.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  src: PropTypes.string,
  href: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
};
IconButton.defaultProps = {
  id: '',
  src: '',
  alt: '',
  href: '#',
  width: 100,
  height: 100,
  className: 'class',
  style: {},
};
export default IconButton;
