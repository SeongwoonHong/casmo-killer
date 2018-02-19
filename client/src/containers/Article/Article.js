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
  render() {
    const {
      activePost, user, createCommentRequest, giveLikesRequest, giveDisLikesRequest, deleteCommentRequest, updateCommentRequest, replyCommentRequest, replyComment, replyCommentReset
    } = this.props;
    return (
      <div id="articles-container">
        {
          activePost.status === 'WAITING'
          && <LoadingCircle />
        }
        {
          activePost.status === 'SUCCESS'
          &&
          <div>
            <ArticleBody activePost={activePost.data} />
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
              // user={this.props.user} 나중에 옮기면 이거 코멘트 풀어야함.
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
