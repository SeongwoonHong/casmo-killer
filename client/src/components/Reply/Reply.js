/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { Link } from 'react-router-dom';
import animate from 'gsap-promise';
import { Field } from 'redux-form';
import Materialize from 'materialize-css';
import renderTextArea from '../PostInputForm/renderTextArea';
import './Reply.scss';

const formatter = buildFormatter(krStrings);

export default class Reply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false
    };
  }
  componentWillMount() {
    console.log(this.props.comment);
    console.log(this.props.commentId);
    console.log('===');
    this.props.initialize({
      [`comment${this.props.commentId}`]: this.props.comment
    });
  }
  componentDidMount = () => {
    animate.set(this.component, { autoAlpha: 0, y: '-20px' });
  }
  componentWillUnmount = () => {
    TweenMax.killTweensOf(this.like);
    TweenMax.killTweensOf(this.disLike);
  }
  onDeleteHandler = () => {
    this.props.deleteCommentRequest(this.props.postId, this.props.commentId, this.props.index)
      .then(() => {
        Materialize.toast('The comment is deleted', 2000, 'round');
      }).catch(() => Materialize.toast('Something went wrong', 2000, 'round'));
  }
  animateIn = () => {
    return animate.to(this.component, 0.5, { autoAlpha: 1, y: '0px' });
  }
  animateOut = () => {
    return animate.to(this.component, 0.5, { autoAlpha: 0, scale: 0 });
  }
  componentWillAppear = (done) => {
    this.animateIn().then(done);
  }
  componentWillEnter = (done) => {
    this.animateIn().then(done);
  }
  componentWillLeave = (done) => {
    this.animateOut().then(done);
  }
  likesHandler = (postId, type, commentId) => {
    if (this.props.commentAuthorName === this.props.postAuthorName) {
      this.clickAnimation(this.like);
      this.props.giveLikesRequest(postId, type, commentId);
    }
  }
  disLikesHandler = (postId, type, commentId) => {
    if (this.props.commentAuthorName === this.props.postAuthorName) {
      this.clickAnimation(this.disLike);
      this.props.giveDisLikesRequest(postId, type, commentId);
    }
  }
  clickAnimation = (ref) => {
    animate.to(ref, 0.5, { scale: 1.5, ease: Expo.easeOut }).then(() => {
      animate.to(ref, 1, { scale: 1, ease: Expo.easeOut });
    });
  }
  toggleEdit = () => {
    this.setState({
      edit: !this.state.edit
    });
  }
  render() {
    const {
      postId, commentAuthorName, comment, date, commentId, postAuthorName, likes, disLikes
    } = this.props;
    const editView = (
      <Field
        name={`comment${commentId}`}
        type="text"
        component={renderTextArea}
      />
    );
    return (
      <div className="card reply" ref={el => this.component = el}>
        <div className="card-content" key={postId}>
          <div className="header">
            <Link to="/"><img src="/testIcon.png" alt="" className="circle avartar_circle" /></Link>
            <div className="header-info">
              <div className="writer">{commentAuthorName}</div>
              <div className="created">Created : <TimeAgo date={date} formatter={formatter} /></div>
            </div>
          </div>
          { this.state.edit ? editView : <div className="comment">{comment}</div> }
          <div className="preferences-panel">
            <img
              src="/like_icon.png"
              alt=""
              className="like-icon"
              ref={el => this.like = el }
              onClick={() => this.likesHandler(postId, 'comment', commentId)}
              onKeyDown={() => {}}
            />
            <span className="likes">{likes.length}</span>
            <img
              src="/dislike_icon.png"
              alt=""
              className="dislike-icon"
              ref={el => this.disLike = el}
              onClick={() => this.disLikesHandler(postId, 'comment', commentId)}
              onKeyDown={() => {}}
            />
            <span className="dislikes">{disLikes.length}</span>
            <span
              className="btn-delete"
              onClick={() => {
                if (this.state.edit) this.toggleEdit();
                else this.onDeleteHandler();
              }}
              onKeyDown={() => {}}
              role="presentation"
            >
              { this.state.edit ? 'Cancel' : 'Delete' }
            </span>
            <span
              className="btn-edit"
              onClick={this.toggleEdit}
              onKeyDown={() => {}}
              role="presentation"
            >
              Edit
            </span>
            {/* <Button
              text="Edit"
              onClick={this.toggleEdit}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
              className="btn waves-effect blue waves-light edit"
              isLink={false}
            />
            <Button
              text="Delete"
              onClick={this.toggleEdit}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
              className="btn waves-effect blue waves-light edit"
              isLink={false}
            /> */}
          </div>
        </div>
      </div>
    );
  }
}

Reply.defaultProps = {
  postId: '',
  commentAuthorName: '',
  comment: '',
  date: '',
};

Reply.propTypes = {
  postId: PropTypes.string,
  commentAuthorName: PropTypes.string,
  comment: PropTypes.string,
  date: PropTypes.string,
};
