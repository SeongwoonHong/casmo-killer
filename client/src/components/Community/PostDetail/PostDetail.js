import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Materialize from 'materialize-css';
import ReplyNew from '../../ReplyNew/ReplyNew';
import ReplyList from '../../ReplyList/ReplyList';
import PostShow from '../../PostShow/PostShow';
import PostInputForm from '../../PostInputForm';
import LoadingCircle from '../../Loading/LoadingCircle';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
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
    this.toggleEdit = this.toggleEdit.bind(this);
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

  toggleEdit() {
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
        Materialize.toast('Success!', 2000);
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

  cancelHandler = () => {
    this.props.history.push({
      pathname: this.state.baseUrl,
      state: { page: this.props.location.state.page, selected: this.props.location.state.selected }
    });
  }

  render() {
    const { data, status, error } = this.props.activePost;

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
          />
        </div>
        <div className="card-action">
          <a
            onClick={this.cancelHandler}
            onKeyDown={this.cancelHandler}
            role="button"
            tabIndex={0}
          >
            Back
          </a>
          <a
            onClick={this.toggleEdit}
            onKeyDown={this.toggleEdit}
            role="button"
            tabIndex={0}
          >
            Edit
          </a>
          <a
            onClick={this.handleDelete}
            onKeyDown={this.handleDelete}
            role="button"
            tabIndex={0}
          >
            Delete
          </a>
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
        <ReplyNew
          onReply={this.handleReply}
          title="댓글"
          postId={data._id}
        />
      </div>
    );
  }
}

export default withRouter(PostDetail);
