import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { Field } from 'redux-form';
import krStrings from 'react-timeago/lib/language-strings/ko';
import animate from 'gsap-promise';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { toast } from 'react-toastify';
import ReduxFormField from '../../../components/ReduxFormField/ReduxFormField';
import Quote from '../../Quote/Quote';
import './Comment.scss';

const formatter = buildFormatter(krStrings);

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      height: null
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
        toast.info('The comment is deleted', { position: toast.POSITION_TOP_RIGHT });
      }).catch(() => toast.info('Something went wrong', { position: toast.POSITION_TOP_RIGHT }));
  }
  likesHandler = (postId, type, commentId) => {
    if (this.props.user.isLoggedIn && (this.props.commentAuthor !== this.props.user.displayName)) {
      this.clickAnimation(this.like);
      this.props.giveLikesRequest(postId, type, commentId);
    }
  }
  disLikesHandler = (postId, type, commentId) => {
    if (this.props.user.isLoggedIn && (this.props.commentAuthor !== this.props.user.displayName)) {
      this.clickAnimation(this.disLike);
      this.props.giveDisLikesRequest(postId, type, commentId);
    }
  }
  clickAnimation = (ref) => {
    animate.to(ref, 0.5, { scale: 1.5, ease: Expo.easeOut }).then(() => {
      animate.to(ref, 1, { scale: 1, ease: Expo.easeOut });
    });
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
  validateAndPost = (values) => {
    const { postId, commentId } = this.props;
    const contents = values[`comment${this.props.commentId}`].trim();
    if (typeof contents !== 'string' || !contents) {
      toast.error('Content cannot be empty!', { position: toast.POSITION_TOP_RIGHT });
      return;
    }
    return this.props.updateCommentRequest(postId, commentId, contents).then(() => {
      if (this.props.updateComment.status === 'SUCCESS') {
        toast.info('Your comment is updated', { position: toast.POSITION_TOP_RIGHT })
      } else {
        toast.error('Something went wrong', { position: toast.POSITION_TOP_RIGHT })
      }
      this.setState({ edit: false });
    });
  }
  replyComment = () => {
    const {
      comment, commentId, commentAuthor, postId
    } = this.props;
    const offset = document.querySelector('.articles').offsetHeight;
    if (window.outerWidth < 990) {
      TweenMax.to(document.querySelector('.app-container'), 1, { scrollTo: { y: offset, autoKill: true }, ease: Bounce.easeOut });
    } else {
      TweenMax.to(document.querySelector('.root-container'), 1, { scrollTo: { y: offset, autoKill: true }, ease: Bounce.easeOut });
    }
    this.state.edit && this.toggleEdit();
    this.props.replyCommentRequest({
      comment, commentId, commentAuthor, postId
    });
  }
  toggleEdit = () => {
    this.setState({
      edit: !this.state.edit
    });
  }
  resizeHandler = () => {
    this.setState({
      height: document.getElementById(`comment${this.props.commentId}`).scrollHeight
    });
  }
  render() {
    const {
      comment, commentId, avatar, date, isEdited, likes, disLikes, form, parentAuthor, commentAuthor, commentAuthorId, parentContent, handleSubmit, postId
    } = this.props;
    const buttons = (
      <span>
        <i
          className="material-icons cursor"
          onClick={() => {
            if (this.state.edit) this.toggleEdit();
            else this.onDeleteHandler();
          }}
          role="presentation"
          onKeyDown={() => {}}
        >
          { this.state.edit ? 'cancel' : 'delete' }
        </i>
        {
          this.state.edit ?
            <i
              className="material-icons cursor"
              onClick={this.props.handleSubmit(this.validateAndPost)}
              onKeyDown={() => {}}
              role="presentation"
            >
              save
            </i> :
            <i
              className="material-icons cursor"
              onClick={this.toggleEdit}
              onKeyDown={() => {}}
              role="presentation"
            >
              edit
            </i>
        }
      </span>
    );
    const editView = (
      <Field
        name={`comment${commentId}`}
        type="text"
        component={ReduxFormField}
        mode="textarea"
        style={{ height: `${this.state.height}px` }}
        onChange={this.resizeHandler}
      />
    );
    return (
      <div className="comment" ref={el => this.component = el}>
        <div className="comment-header">
          <img src={avatar} alt={avatar} className="comment-avatar" />
          <span>
            <Link
              to={{
                pathname: `/user/info/${commentAuthorId}`,
                state: { userName: commentAuthor, avatar }
                }}
            >
              {commentAuthor}
            </Link>
            <div className="created">Created : <TimeAgo date={date} formatter={formatter} />{ isEdited && <span> (edited)</span>}</div>
          </span>
        </div>
        {
          parentAuthor
          &&
          <div className="quote-wrapper">
            <Quote
              author={parentAuthor}
              content={parentContent}
            />
          </div>
        }
        <form name="replyForm" className="comment-form" onSubmit={handleSubmit(this.validateAndPost)} ref={el => this.form = el}>
          { this.state.edit ? editView : <pre readOnly className="comment-body">{comment}</pre> }

          <div className="comment-footer">
            <div className="like-dislike">
              <img
                src="/like_icon.png"
                alt="like_icon"
                className="like-icon"
                ref={el => this.like = el }
                onClick={() => this.likesHandler(postId, 'comment', commentId)}
                onKeyDown={() => {}}
                role="presentation"
              />
              <span className="likes">{likes.length}</span>
              <img
                src="/dislike_icon.png"
                alt="dislike_icon"
                className="dislike-icon"
                ref={el => this.disLike = el}
                onClick={() => this.disLikesHandler(postId, 'comment', commentId)}
                onKeyDown={() => {}}
                role="presentation"
              />
              <span className="dislikes">{disLikes.length}</span>
            </div>
            <span className="buttons">
              {
                this.props.user.isLoggedIn &&
                <i
                  className="material-icons cursor"
                  role="presentation"
                  onKeyDown={() => {}}
                  onClick={this.replyComment}
                >
                  reply
                </i>
              }
              {
                this.props.user.displayName === commentAuthor ? buttons : undefined
              }
            </span>
          </div>
        </form>
      </div>
    );
  }
}

Comment.defaultProps = {
  user: {
    isLoggedIn: true,
    displayName: 'displayName'
  }
};

Comment.propTypes = {
  user: PropTypes.object
};

export default Comment;
