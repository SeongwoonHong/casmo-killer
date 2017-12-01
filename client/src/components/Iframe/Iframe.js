import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Iframe extends Component {
  componentDidMount() {
    this._updateIframe();
  }
  componentDidUpdate() {
    this._updateIframe();
  }
  _updateIframe() {
    const document = this.iframe.contentDocument;
    const head = document.getElementsByTagName('head')[0];
    document.body.innerHTML = this.props.content;
    const ref = document.createElement('link');
    ref.rel = 'stylesheet';
    ref.type = 'text/css';
    ref.href = this.props.stylesheets;
    head.appendChild(ref);
  }
  render() {
    return (
      <iframe
        ref={el => this.iframe = el}
        style={this.props.style}
        title="Iframe"
      />
    );
  }
}
Iframe.defaultProps = {
  style: ''
};

Iframe.propTypes = {
  style: PropTypes.string
};
export default Iframe;
