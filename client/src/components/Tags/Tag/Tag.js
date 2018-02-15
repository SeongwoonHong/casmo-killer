import React, { Component } from 'react';
import animate from 'gsap-promise';
import './Tag.scss';

class Tag extends Component {
  componentWillEnter = (done) => {
    this.animateIn().then(done);
  }
  componentWillAppear = (done) => {
    this.animateIn().then(done);
  }
  componentWillLeave = (done) => {
    this.animateOut().then(done);
  }
  animateIn = () => {
    return animate.from(this.component, 0.5, { y: '-30%', autoAlpha: 0 });
  }

  animateOut = () => {
    return animate.all([
      animate.to(this.component, 0.5, { y: '-30%', autoAlpha: 0 })
    ]);
  }

  render() {
    const { tag, index, onDeleteTagHandler } = this.props;
    return (
      <span className="tag" ref={ el => this.component = el }>
        { tag }
        <span
          className="close"
          onClick={() => onDeleteTagHandler(index)}
          onKeyDown={() => {}}
          role="presentation"
        />
      </span>
    );
  }
}

export default Tag;
