import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import './UserMenu.scss';

import UserMenuDropdown from './UserDropdown/UserMenuDropdown';

class UserMenu extends Component {

  render() {

    const { layout, user } = this.props;
    const isDeskTop = layout.breakPoint === 'lg' || layout.breakPoint === 'xl';

    const UserMenuButton = (isLoggedIn) => {
      if (isLoggedIn) {
        return (
          <a
            role="button"
            tabIndex={ 0 }
            className="btn teal darken-4"
            onBlur={ () => {
              if (layout.isUserMenuVisible) {
                this.props.toggleUserMenu();
              }
            } }
            onClick={ () => {
              this.props.toggleUserMenu();
            } }
            onKeyDown={ () => {
            } }>
            <i className="material-icons">
              {
                layout.isUserMenuVisible
                  ? 'person_outline'
                  : 'person'
              }
            </i>
          </a>
        );
      }
      return (
        <NavLink to="/login" className="btn teal darken-4">
          <i className="material-icons">person</i>
        </NavLink>
      );
    };

    return (
      <div className="user-menu">
        <NavLink
          to="/asdf"
          className={ classnames('btn teal darken-4', {
            hide: !user.isLoggedIn || !isDeskTop
          }) }>
          <i className="material-icons">
            notifications_none
          </i>
          <span className="notification-badge">
            N
          </span>
        </NavLink>
        { UserMenuButton(user.isLoggedIn) }
        {
          user.isLoggedIn && layout.isUserMenuVisible
            ? <UserMenuDropdown showNotification={ user.isLoggedIn && !isDeskTop } />
            : null
        }
      </div>
    );

  }

}

export default UserMenu;
