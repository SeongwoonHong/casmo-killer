/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import animate from 'gsap-promise';
import classnames from 'classnames';

class SpanAnimatedText extends React.Component {
  componentDidMount = () => {
    if (this.props.animateAtDidMount) {
      const animateText = [...this.component.querySelectorAll('.animate-text')];
      animate.set(animateText, { autoAlpha: 0 }).then(() => {
        animate.staggerTo(animateText, 1, { autoAlpha: 1, delay: this.props.delay }, 0.05);
      });
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if (this.props.text !== nextProps.text) {
      return this.animateIn();
    }
    return 0;
  }
  getSpanText = (text) => {
    return text.split('').map((txt, i) => {
      return (
        <span
          key={`${txt}-${i}`}
          className={`animate-text txt-${i}`}
        >
          { txt }
        </span>
      );
    });
  }
  animateIn = () => {
    const animateText = [...this.component.querySelectorAll('.animate-text')];
    return animate.staggerFrom(animateText, 0.05, { autoAlpha: 0 }, 0.01);
  }
  componentWillEnter = (done) => {
    this.animateIn().then(done);
  }
  componentWillAppear = (done) => {
    this.animateIn().then(done);
  }
  render() {
    return (
      <div style={ this.props.style } className={classnames('SpanAnimatedText', this.props.className)} ref={el => this.component = el}>
        { this.getSpanText(this.props.text) }
      </div>
    );
  }
}
SpanAnimatedText.defaultProps = {
  text: '',
  animateAtDidMount: false,
  className: ''
};

SpanAnimatedText.propTypes = {
  text: PropTypes.string,
  animateAtDidMount: PropTypes.bool,
  className: PropTypes.string
};
export default SpanAnimatedText;
