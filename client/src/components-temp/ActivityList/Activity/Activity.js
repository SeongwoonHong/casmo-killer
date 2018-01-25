import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';

import './Activity.scss';

class Activity extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const current = {
      props: this.props,
      state: this.state
    };

    const next = {
      props: nextProps,
      state: nextState
    };

    const update = JSON.stringify(current) !== JSON.stringify(next);
    return update;
  }

  render() {
    const { data } = this.props;

    const activityDescription = (activityData) => {
      const post = activityData.payload.post.postId;
      const comment = activityData.payload.post.commentId;

      if (activityData.type === 'COMMENT_LIKE') {
        return (
          <div>
            <div> #{post.postNum} 게시물의 <Link to={`/user/info/${comment._id}`} className="username">{comment.displayName}</Link>님의 댓글을 추천 하였습니다.</div>
            <Link to={`/acricle/${post._id}`} className="username">{post.title}</Link>
          </div>
        );
      } else if (activityData.type === 'COMMENT_DISLIKE') {
        return (
          <div>
            <div> #{post.postNum} 게시물의 <Link to={`/user/info/${comment._id}`} className="username">{comment.displayName}</Link>님의 댓글을 비추천 하였습니다.</div>
            <Link to={`/acricle/${post._id}`} className="username">{post.title}</Link>
          </div>
        );
      } else if (activityData.type === 'POST_LIKE') {
        return (
          <div>
            <div> #{post.postNum} 게시물을 추천 하였습니다.</div>
            <Link to={`/article/${post._id}`} className="username">{post.title}</Link>
          </div>
        );
      } else if (activityData.type === 'POST_DISLIKE') {
        return (
          <div>
            <div> #{post.postNum} 게시물을 비추천 하였습니다.</div>
            <Link to={`/article/${post._id}`} className="username">{post.title}</Link>
          </div>
        );
      } else if (activityData.type === 'POST_WRITE') {
        return (
          <div>
            <div> #{post.boardId} 에 게시물을 작성하였습니다.</div>
            <Link to={`/article/${post._id}`} className="username">{post.title}</Link>
          </div>
        );
      } else if (activityData.type === 'COMMENT_WRITE') {
        return (
          <div>
            <div> #{post.postNum} 게시물에 댓글을 남겼습니다.</div>
            <Link to={`/article/${post._id}`} className="username">{post.title}</Link>
          </div>
        );
      }
    };

    return (
      <div className="container memo">
        <div className="card">
          <div className="info">
            {activityDescription(data)}
          </div>
          <div className="card-content">
            {data.contents}
          </div>
          <div className="footer">
            <span className="star-count"><TimeAgo date={data.date} /></span>
          </div>
        </div>
      </div>
    );
  }
}

export default Activity;
