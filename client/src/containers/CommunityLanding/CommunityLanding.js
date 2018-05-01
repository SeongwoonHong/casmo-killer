import React, { Component } from 'react';
import './CommunityLanding.scss';
import SimplePost from '../../components/SimplePost/SimplePost';

class CommunityLanding extends Component {

  componentDidMount = () => {
    this.props.fetchBoardsRequestWithSort('desc', 10);
    this.props.fetchMostLikedPosts();
  };

  renderBoardNumber = number => (
    <div>게시글: { number }</div>
  );

  renderPostNumber = number => (
    <div>좋아요: { number }</div>
  );

  render() {
    const { hotBoardList, hotPostList } = this.props;
    if (hotBoardList.status !== 'SUCCESS' || hotPostList.status !== 'SUCCESS') return null;

    return (
      <div id="community-landing">
        <div className="top">
          <div className="hot-boards">
            <div className="title"><i className="material-icons">whatshot</i> Hot Boards</div>
            <div className="body">
              {
                hotBoardList.data.map((data) => {
                  return (
                    <SimplePost
                      key={ data._id }
                      to={ `/articles/${data.boardId}` }
                      title={ data.boardId }
                      author={ data.author[0].displayName }
                      number={ this.renderBoardNumber(data.postsCount) }
                      date={ data.date }
                    />
                  );
                })
              }
            </div>
          </div>
          <div className="hot-posts">
            <div className="title"><i className="material-icons">child_care</i> Hot Posts</div>
            <div className="body">
              {
                hotPostList.data.map((data) => {
                  return (
                    <SimplePost
                      key={ data._id }
                      title={ data.title }
                      to={ `/article/${data._id}` }
                      author={ data.author[0].displayName }
                      number={ this.renderPostNumber(data.likesCount) }
                      date={ data.date }
                    />
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommunityLanding;
