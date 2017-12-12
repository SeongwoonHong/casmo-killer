/* eslint-disable max-len */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
// import { SubmissionError } from 'redux-form';
import Materialize from 'materialize-css';
import ReplyNew from '../../ReplyNew/ReplyNew';
import ReplyList from '../../ReplyList';
import PostShow from '../../PostShow/PostShow';
import PostInputForm from '../../PostInputForm';
import LoadingCircle from '../../Loading/LoadingCircle';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import Button from '../../Button/Button';
// import { editPost, editPostFailure, editPostSuccess } from '../../../actions/post';
import './PostDetail.scss';

class PostDetail extends Component {
  constructor(props) {
    super(props);
    const pathName = props.location.pathname;
    const baseUrl = pathName.substring(0, pathName.lastIndexOf('/'));
    this.state = {
      editMode: false,
      baseUrl
    };
  }

  componentDidMount() {
    this.props.fetchPostRequest(this.props.postId);
  }

  componentWillUnmount() {
    // Important! If your component is navigating based on
    // some global state(from say componentWillReceiveProps)
    // always reset that global state back to null when you REMOUNT
    this.props.resetPostProps();
  }
  onLikesHandler = () => {
    if ((this.props.user.username !== this.props.activePost.data.authorName) && this.props.user.isLoggedIn) {
      return this.props.giveLikesRequest(this.props.activePost.data._id, 'post');
    }
  }
  onDislikesHandler = () => {
    if ((this.props.user.username !== this.props.activePost.data.authorName) && this.props.user.isLoggedIn) {
      return this.props.giveDislikesRequest(this.props.activePost.data._id, 'post');
    }
  }
  onDeleteHandler = () => {
    //
  }
  toggleEdit = () => {
    this.setState({
      editMode: !this.state.editMode
    });
  }

  // For any field errors upon submission (i.e. not instant check)
  validateAndEditPost = (values) => {
    const id = this.props.activePost.data._id;
    return this.props.editPostRequest(id, values).then(() => {
      if (this.props.editPost.status === 'SUCCESS') {
        Materialize.toast('Success!', 2000);
        this.toggleEdit();
      } else {
        Materialize.toast($(`<span style="color: #00c853">Error: ${this.props.editPost.error.message}</span>`), 3000);
      }
    }
    );
  }

  handleDelete = () => {
    return this.props.onDeleteClick().then(() => {
      if (this.props.deletePost.status === 'SUCCESS') {
        Materialize.toast('A post is deleted!', 2000);
        this.props.history.push(this.state.baseUrl);
      } else {
        Materialize.toast($(`<span style="color: #00c853">Error: ${this.props.editPost.error.message}</span>`), 3000);
      }
    });
  }

  handleReply = (comment, postId) => {
    return this.props.createReplyRequest(comment, postId).then(() => {
      if (this.props.newComment.status === 'SUCCESS') {
        Materialize.toast('Success!', 2000);
      } else {
        Materialize.toast($(`<span style="color: #00c853">Error: ${this.props.editPost.error.message}</span>`), 3000);
      }
    });
  }

  render() {
    const { data, status, error } = this.props.activePost;
    const { user } = this.props;
    if (status === 'WAITING') {
      return (
        <div className="board_detail_loading">
          <LoadingCircle />
        </div>
      );
    } else if (error) {
      return (
        <div className="board_detail_error">
          {Materialize.toast($(`<span style="color: #00c853">Error: ${error.message}</span>`), 3000)}
        </div>
      );
    } else if (!data) {
      return (
        <div className="board_detail_loading">
          <LoadingCircle />
        </div>
      );
    }

    const editView = (
      <PostInputForm
        validateAndPost={this.validateAndEditPost}
        toggleEdit={this.toggleEdit}
        formType="edit"
        title={data.title}
        contents={data.contents}
      />
    );

    const detailView = (
      <div className="card">
        <div className="card-content">
          <PostShow
            activePost={data}
            onLikesHandler={this.onLikesHandler}
            onDislikesHandler={this.onDislikesHandler}
          />
        </div>
        <div className="card-action">
          {
            user.username === data.authorName &&
            [
              <Button
                text="Edit"
                onClick={this.toggleEdit}
                onKeyDown={() => {}}
                role="button"
                tabIndex={0}
                key="btn1"
                className="btn waves-effect teal waves-light edit"
                isLink={false}
              />,
              <Button
                onClick={this.handleDelete}
                onKeyDown={() => {}}
                role="button"
                tabIndex={0}
                key="btn2"
                className="btn waves-effect teal waves-light delete"
                text="Delete"
                isLink={false}
              />
            ]
          }
        </div>
      </div>
    );

    return (
      <div className="board_detail">
        <BreadCrumbs url={this.state.baseUrl} />
        { this.state.editMode ? editView : detailView }
        <ReplyList
          comments={data.comments}
        />
        {
          this.props.user.isLoggedIn
          && <ReplyNew
            onReply={this.handleReply}
            title="댓글"
            postId={data._id}
          />
        }
      </div>
    );
  }
}

export default withRouter(PostDetail);
