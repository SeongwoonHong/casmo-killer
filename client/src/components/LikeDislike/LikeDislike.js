/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import animate from 'gsap-promise';
import './LikeDislike.scss';

class LikeDislike extends Component {
  constructor(props) {
    super(props);
    this.like = [];
    this.disLike = [];
  }
  likesHandler = async () => {
    this.props.onLikesHandler()
      .then(() => this.clickAnimation(this.like))
      .catch(() => {}); // once we have our custom toast, it will go here to indicate that users cannot give likes or dislikes to their own posts.
  }
  disLikesHandler = () => {
    this.props.onDislikesHandler()
      .then(() => this.clickAnimation(this.disLike))
      .catch(() => {}); // once we have our custom toast, it will go here to indicate that users cannot give likes or dislikes to their own posts.
  }
  clickAnimation = (ref) => {
    animate.to(ref[0], 0.5, { scale: 1.5, ease: Expo.easeOut }).then(() => {
      animate.to(ref[0], 1, { scale: 1, ease: Expo.easeOut });
    });
  }
  render() {
    const { likes, disLikes } = this.props;
    return (
      <div className="like-dislike">
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
LikeDislike.defaultProps = {
  likes: 0,
  disLikes: 0,
  onLikesHandler: () => { console.warn('function onLikesHandler is not defined'); },
  onDislikesHandler: () => { console.warn('function onDislikesHandler is not defined'); }
};

LikeDislike.propTypes = {
  likes: PropTypes.number,
  disLikes: PropTypes.number,
  onLikesHandler: PropTypes.func,
  onDislikesHandler: PropTypes.func
};
export default LikeDislike;
