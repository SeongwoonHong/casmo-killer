import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './DisplayManager.scss';

class DisplayManager extends Component {
  render() {
    const { authorId, authorDisplayName, avatar } = this.props;
    return (
      <div className={this.props.className}>
        관리자:
        <div className="user-btn">
          <Link
            to={{
              pathname: `/user/info/${authorId}`,
              state: { userName: authorDisplayName, avatar }
              }}
            >
            {authorDisplayName}
          </Link>
        </div>
      </div>
    );
  }
}

export default DisplayManager;
