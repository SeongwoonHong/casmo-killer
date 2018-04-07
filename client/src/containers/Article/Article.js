import React, { Component } from 'react';
import LoadingCircle from '@sharedComponents/LoadingCircle';
import ArticleBody from '../../components/ArticleBody/ArticleBody';
import CommentList from '../../components/CommentList/CommentList';
import CommentNew from '../../components/CommentNew/CommentNew';

import './Article.scss';

class Article extends Component {
  componentDidMount = () => {
    this.props.fetchPostRequest(this.props.postId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps === undefined) {
      return false;
    }
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.fetchPostRequest(this.props.postId);
    }
  }
  onLikesHandler = () => {
    return new Promise((resolve, reject) => {
      if ((this.props.user.displayName !== this.props.activePost.data.author.displayName) && this.props.user.isLoggedIn) {
        this.props.giveLikesRequest(this.props.activePost.data._id, 'post');
        return resolve();
      }
      return reject();
    });
  }
  onDislikesHandler = () => {
    return new Promise((resolve, reject) => {
      if ((this.props.user.displayName !== this.props.activePost.data.author.displayName) && this.props.user.isLoggedIn) {
        this.props.giveDisLikesRequest(this.props.activePost.data._id, 'post');
        return resolve();
      }
      return reject();
    });
  }
  render() {
    const {
      activePost, user, createCommentRequest, giveLikesRequest, giveDisLikesRequest, deleteCommentRequest, updateCommentRequest, replyCommentRequest, replyComment, replyCommentReset, deletePostRequest, deletePost, openUserInfoModal, tagsSearchRequest, editPostRequest, editPost
    } = this.props;
    return (
      <div id="articles-container">
        {
          activePost.status === 'WAITING'
          && <LoadingCircle color="#515151" />
        }
        {
          activePost.status === 'SUCCESS'
          &&
          <div>
            <ArticleBody
              activePost={activePost.data}
              deletePostRequest={deletePostRequest}
              user={user}
              deletePost={deletePost}
              editPost={editPost}
              openUserInfoModal={openUserInfoModal}
              tagsSearchRequest={tagsSearchRequest}
              editPostRequest={editPostRequest}
              giveLikesRequest={this.onLikesHandler}
              giveDisLikesRequest={this.onDislikesHandler}
            />
            <CommentList
              updateComment={this.props.updateComment}
              comments={activePost.data.comments}
              postId={activePost.data._id}
              user={user}
              giveLikesRequest={giveLikesRequest}
              giveDisLikesRequest={giveDisLikesRequest}
              deleteCommentRequest={deleteCommentRequest}
              updateCommentRequest={updateCommentRequest}
              replyCommentRequest={replyCommentRequest}
            />
            <CommentNew
              user={user}
              postId={activePost.data._id}
              createCommentRequest={createCommentRequest}
              replyCommentReset={replyCommentReset}
              replyComment={replyComment}
            />
          </div>
        }
      </div>
    );
  }
}

export default Article;
