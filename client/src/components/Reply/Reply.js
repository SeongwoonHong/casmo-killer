/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import PlainBtn from 'sharedComponents/PlainBtn';
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
    if (this.props.user.isLoggedIn && (this.props.commentAuthorName !== this.props.user.username)) {
      this.clickAnimation(this.like);
      this.props.giveLikesRequest(postId, type, commentId);
    }
  }
  disLikesHandler = (postId, type, commentId) => {
    if (this.props.user.isLoggedIn && (this.props.commentAuthorName !== this.props.user.username)) {
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
  validateAndPost = (values) => {
    const { postId, commentId } = this.props;
    const contents = values[`comment${this.props.commentId}`].trim();
    if (typeof contents !== 'string' || !contents) {
      Materialize.toast($('<span style="color: red">Content cannot be empty</span>'), 3000, 'rounded');
      return;
    }
    return this.props.updateCommentRequest(postId, commentId, contents).then(() => {
      if (this.props.updateComment.status === 'SUCCESS') {
        Materialize.toast('<span style="color: teal">Your comment is updated!</span>', 2000, 'rounded');
      } else {
        Materialize.toast($('<span style="color: red">Content cannot be empty</span>'), 3000, 'rounded');
      }
      this.setState({ edit: false });
    });
  }
  render() {
    const {
      postId, commentAuthor, comment, date, commentId, postAuthor, likes, disLikes, handleSubmit, isEdited
    } = this.props;
    const editView = (
      <Field
        name={`comment${commentId}`}
        type="text"
        component={renderTextArea}
      />
    );
    const buttons = (
      <span>
        <span
          className="btn-delete btn"
          onClick={() => {
            if (this.state.edit) this.toggleEdit();
            else this.onDeleteHandler();
          }}
          role="presentation"
          onKeyDown={() => {}}
        >
          { this.state.edit ? 'Cancel' : 'Delete' }
        </span>
        {
          this.state.edit ?
            <button
              type="submit"
              className="btn btn-edit"
            >
              Save
            </button> :
            <span
              className="btn-edit btn"
              onClick={this.toggleEdit}
              onKeyDown={() => {}}
              role="presentation"
            >
              Edit
            </span>
        }
      </span>
    );
    return (
      <div className="card reply" ref={el => this.component = el}>
        <div className="card-content" key={postId}>
          <div className="header">
            <img src={postAuthor.avatar} alt="" className="circle avartar_circle" />
            <div className="header-info">
              <div className="writer">
                <PlainBtn
                  onClick={
                    () => { this.props.openUserInfoModal(postAuthor); }
                  }
                >
                  <a href="#">{postAuthor.username}</a>
                </PlainBtn>
              </div>
              <div className="created">Created : <TimeAgo date={date} formatter={formatter} />{ isEdited && <span> (edited)</span>}</div>
            </div>
          </div>
          <form onSubmit={handleSubmit(this.validateAndPost)} ref={el => this.form = el}>
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
              {
                this.props.user.username === commentAuthor.username ? buttons : undefined
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Reply.defaultProps = {
  postId: '',
  commentAuthor: null,
  postAuthor: null,
  comment: '',
  date: '',
};

Reply.propTypes = {
  postId: PropTypes.string,
  commentAuthor: PropTypes.object,
  postAuthor: PropTypes.object,
  comment: PropTypes.string,
  date: PropTypes.string,
};
