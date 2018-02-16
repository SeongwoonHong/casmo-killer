import React, { Component } from 'react';
import ArticleBody from '../../components/ArticleBody/ArticleBody';
import CommentList from '../../components/CommentList/CommentList';
// import Comment from '../../components/CommentList/Comment/Comment';
import CommentNew from '../../components/CommentNew/CommentNew';
// import Button from '../../components/Button/TextButton/TextButton';
// import Quote from '../../components/Quote/Quote';
import './Article.scss';

class Article extends Component {
  render() {
    return (
      <div id="articles-container">
        <ArticleBody />
        <CommentList
          updateComment={this.props.updateComment}
          activePost={this.props.activePost}
          // user={this.props.user} 나중에 옮기면 이거 코멘트 풀어야함.
        />
        <CommentNew />
      </div>
    );
  }
}

export default Article;
