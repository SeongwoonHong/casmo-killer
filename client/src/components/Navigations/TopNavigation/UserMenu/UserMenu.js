import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import './UserMenu.scss';

import UserMenuDropdown from './UserDropdown';

class UserMenu extends Component {

  render() {

    const { layout, user } = this.props;

    const Notifications = (
      <NavLink
        to="/user/notifications"
        className="btn notification">
        <i className="material-icons">
          notifications_none
        </i>
        <span className="notification-badge">N</span>
      </NavLink>
    );

    const UserProfile = currentUser => (
      <div
        role="button"
        tabIndex={ 0 }
        className={ classnames('user-profile', {
          active: layout.isUserMenuVisible
        })}
        onBlur={ () => {
          if (layout.isUserMenuVisible) {
            // this.props.toggleUserMenu();
          }
        } }
        onClick={ this.props.toggleUserMenu }
        onKeyDown={ () => {} }>
        {
          currentUser.avatar
            ? (
              <img
                className="user-avatar"
                src={ currentUser.avatar }
                alt={ currentUser.username } />
            )
            : (
              <span className="user-avatar">
                { currentUser.username[0] }
              </span>
            )
        }
        <div className="user-info">
          <span>{ currentUser.username }</span>
          <span>{ currentUser.level || 'newbie' }</span>
        </div>
        <a className="btn">
          <i className="material-icons">
            {
              layout.isUserMenuVisible
                ? 'arrow_drop_up'
                : 'arrow_drop_down'
            }
          </i>
        </a>
      </div>
    );

    const UserMenuButton = (
      <a
        role="button"
        tabIndex={ 0 }
        onClick={ this.props.toggleLoginModal }
        onKeyDown={ () => {} }
        className="btn teal darken-4">
        <i className="material-icons">person</i>
      </a>
    );

    return (
      <div className="user-menu">
        { user.isLoggedIn ? Notifications : null }
        { user.isLoggedIn ? UserProfile(user) : null}
        { !user.isLoggedIn ? UserMenuButton : null }
        { layout.isUserMenuVisible ? <UserMenuDropdown /> : null }
      </div>
    );

  }

}

export default UserMenu;
