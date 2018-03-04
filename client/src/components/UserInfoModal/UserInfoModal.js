/* eslint react/no-unused-state: 0 */
import React, { Component } from 'react';
import ModalContainer from '@sharedComponents/ModalContainer';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import ArticleList from '../ArticleList/ArticleList';
import './UserInfoModal.scss';

class UserInfoModal extends Component {

  constructor(props) {
    super(props);
    const page = 0;
    const currentUrl = this.props.location.pathname;
    const indexOfPost = this.props.location.pathname.lastIndexOf('/');
    const baseUrl = currentUrl.substring(0, indexOfPost);

    this.state = {
      page,
      baseUrl,
      currentCategory: 'activity'
    };
  }
  componentDidMount() {
    this.props.searchPostsRequest('gook', this.state.page);
  }

  changeCategory = (value) => {
    this.setState({
      currentCategory: value
    });
  }
  render() {
    const {
      userInfo, closeUserInfoModal
    } = this.props;
    const { data } = this.props.userPostsList;
    // const { pageCount } = this.props.userPagination;
    if (userInfo === undefined || userInfo._id === null) {
      return null;
    }

    const activeView = (
      <div className="userinfo-modal-body-activity">
        <div className="board_postList">
          {/* <PostList
            postsList={data}
            baseUrl={this.state.baseUrl}
            page={this.state.page}
            selected={0}
          /> */}
          <ArticleList
            articleListData={data}
          />
        </div>
      </div>
    );

    const infoView = (
      <div className="userinfo-modal-body-info">
        info
      </div>
    );
    const renderByUser = (
      <div className="userinfo-modal">
        <div className="userinfo-modal-header">
          <div className="userinfo-modal-avatar">
            <img src={userInfo.avatar} alt="user avatar" />
          </div>
          <div className="userinfo-modal-info">
            <div className="userinfo-modal-info-username">
              <h2>{userInfo.displayName}</h2>
            </div>
            <div className="userinfo-modal-info-detail">
              <div className="info-detail">
                <div className="info-detail-score"><img src="/crown.png" alt="user level" /></div>
              </div>
              <div className="info-detail"><span className="activity_score"><i className="material-icons">directions_run</i>활동</span> 350
              </div>
            </div>
          </div>
        </div>
        <div className="userinfo-modal-category">
          <div className={classnames('category-btn category-infoBtn', { active: this.state.currentCategory === 'info' })}>
            <a href="#" onClick={() => this.changeCategory('info')}>
              <i className="small material-icons">info_outline</i>INFO
            </a>
          </div>
          <div className={classnames('category-btn category-activityBtn', { active: this.state.currentCategory === 'activity' })}>
            <a href="#" onClick={() => this.changeCategory('activity')}>
              <i className="small material-icons">timeline</i>ACTIVITY
            </a>
          </div>
        </div>
        <div className="userinfo-modal-body">
          { this.state.currentCategory === 'activity' ? activeView : infoView }
        </div>
      </div>
    );
    const renderByTags = (
      <div className="userinfo-modal">
        {/* <PostList
          postsList={this.props.userPostsListByTag}
          baseUrl={this.state.baseUrl}
          page={this.state.page}
          closeAndRedirect
          closeUserInfoModal={this.props.closeUserInfoModal}
          openUserInfoModal={this.props.openUserInfoModal}
          selected={0}
        /> */}
        <ArticleList
          articleListData={this.props.userPostsListByTag}
          closeAndRedirect
          closeUserInfoModal={this.props.closeUserInfoModal}
        />
      </div>
    );
    return (
      <ModalContainer
        ref={ el => this.component = el }
        onClose={ closeUserInfoModal }>
        {
          this.props.userInfo.mode === 'user' ?
          renderByUser : renderByTags
        }
      </ModalContainer>
    );
  }
}

export default withRouter(UserInfoModal);
