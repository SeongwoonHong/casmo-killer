import React, { Component } from 'react';
import ModalContainer from 'sharedComponents/ModalContainer';
import { withRouter } from 'react-router-dom';
import PostList from '../PostList/PostList';
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
      baseUrl
    };
  }
  componentDidMount() {
    this.props.searchPostsRequest('gook', this.state.page);
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
    return (
      <ModalContainer
        ref={ el => this.component = el }
        onClose={ closeUserInfoModal }>
        <div className="userinfo-modal">
          <div className="userinfo-modal-header">
            <div className="userinfo-modal-avatar">
              <img src={userInfo.avatar} alt="user avatar" />
            </div>
            <div className="userinfo-modal-info">
              <div className="userinfo-modal-info-username">
                <h2>{userInfo.username}</h2>
              </div>
              <div className="userinfo-modal-info-detail">
                <div className="info-detail">
                  <i className="material-icons">star</i>등급<br />
                  <img src="/crown.png" alt="user level" />
                </div>
                <div className="info-detail"><i className="material-icons">directions_run</i>점수<br />350</div>
              </div>
            </div>
          </div>
          <div className="userinfo-modal-body">
            <div className="userinfo-modal-body-active">
              <div className="board_postList">
                <PostList
                  postsList={data}
                  baseUrl={this.state.baseUrl}
                  page={this.state.page}
                  selected={0}
                />
              </div>
            </div>
          </div>
        </div>
      </ModalContainer>
    );
  }
}

export default withRouter(UserInfoModal);
