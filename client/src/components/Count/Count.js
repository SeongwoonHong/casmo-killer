import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import animate from 'gsap-animate';

class Count extends Component {
  // constructor(props) {
  //   super(props);
  //
  // }
  // animateIn = () => {
  //   animate.to(this.component, 0.5)
  // }
  render() {
    return (
      <span
        className={classnames(this.props.className)}
        style={this.props.style}
        ref={el => this.component = el}
      >
        { this.props.contents }
      </span>
    );
  }
}
Count.defaultProps = {
  contents: 0
};

Count.propTypes = {
  contents: PropTypes.number
};
export default Count;
