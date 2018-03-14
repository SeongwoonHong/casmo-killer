import React, { Component } from 'react';
import './UserInfoHeader.scss';

class UserInfoHeader extends Component {
  render() {
    const { userName, avatar } = this.props;

    return (
      <div className="userInfoHeader">
        <div className="userInfo">
          <div className="userAvatar">
            <img src={avatar || '/no-avatar.svg'} alt="avatar" />
          </div>
          <div className="userName">
            {userName}
          </div>
        </div>
      </div>
    );
  }
}

export default UserInfoHeader;
