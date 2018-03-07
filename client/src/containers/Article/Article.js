import React, { Component } from 'react';
import LoadingCircle from '@sharedComponents/LoadingCircle';
import ArticleBody from '../../components/ArticleBody/ArticleBody';
import CommentList from '../../components/CommentList/CommentList';
// import Comment from '../../components/CommentList/Comment/Comment';
import CommentNew from '../../components/CommentNew/CommentNew';
// import Button from '../../components/Button/TextButton/TextButton';

// import Quote from '../../components/Quote/Quote';
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
              isLoggedIn={user.isLoggedIn}
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
