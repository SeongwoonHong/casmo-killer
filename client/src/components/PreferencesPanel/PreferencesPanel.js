/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import animate from 'gsap-promise';
import './PreferencesPanel.scss';

class PreferencesPanel extends Component {
  constructor(props) {
    super(props);
    this.like = [];
    this.disLike = [];
  }
  componentDidMount = () => {
    if (this.like && this.disLike) {
      animate.set(this.like, { autoAlpha: 0, x: '-20px' });
      animate.set(this.disLike, { autoAlpha: 0, x: '20px' });
      this.animateIn();
    }
  }
  componentWillUnmount = () => {
    TweenMax.killTweensOf(this.like);
    TweenMax.killTweensOf(this.disLike);
  }
  likesHandler = () => {
    this.clickAnimation(this.like);
    this.props.onLikesHandler();
  }
  disLikesHandler = () => {
    this.clickAnimation(this.disLike);
    this.props.onDislikesHandler();
  }
  animateIn = async () => {
    return animate.all([
      await animate.to({}, this.props.delay),
      animate.to(this.like[0], 0.5, { autoAlpha: 1, x: '0px' }),
      animate.to(this.like[1], 0.5, { autoAlpha: 1, delay: 0.2 }),
      animate.to(this.disLike[0], 0.5, { autoAlpha: 1, x: '0px', delay: 0.3 }),
      animate.to(this.disLike[1], 0.5, { autoAlpha: 1, delay: 0.4 })
    ]);
  }
  clickAnimation = (ref) => {
    animate.to(ref[0], 0.5, { scale: 1.5, ease: Expo.easeOut }).then(() => {
      animate.to(ref[0], 1, { scale: 1, ease: Expo.easeOut });
    });
  }
  render() {
    const { likes, disLikes } = this.props;
    return (
      <div className="preferences-panel">
        <img
          src="/like_icon.png"
          alt=""
          className="like-icon"
          onClick={this.likesHandler}
          onKeyDown={() => {}}
          ref={el => this.like[0] = el }
        />
        <span className="likes" ref={el => this.like[1] = el}>{ likes }</span>
        <img
          src="/dislike_icon.png"
          alt=""
          className="dislike-icon"
          onClick={this.disLikesHandler}
          onKeyDown={() => {}}
          ref={el => this.disLike[0] = el}
        />
        <span className="dislikes" ref={el => this.disLike[1] = el}>{ disLikes }</span>
      </div>
    );
  }
}
PreferencesPanel.defaultProps = {
  likes: 0,
  disLikes: 0
};

PreferencesPanel.propTypes = {
  likes: PropTypes.number,
  disLikes: PropTypes.number
};
export default PreferencesPanel;
