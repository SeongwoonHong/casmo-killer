import React, { Component } from 'react';
import classnames from 'classnames';
import './UserMenu.scss';

class UserMenu extends Component {
  render() {
    return (
      <ul className={ classnames('dropdown-content', 'user-menu', {
        active: this.props.layout.isUserMenuVisible
      })}>
        <li>
          <a href="#">
            <i className="material-icons">dashboard</i>
            <span>My Board</span>
          </a>
        </li>
        <li>
          <a href="#">
            <i className="material-icons">account_circle</i>
            <span>Profiles</span>
          </a>
        </li>
        <li>
          <a href="#">
            <i className="material-icons">settings</i>
            <span>Settings</span>
          </a>
        </li>
        <li className="divider" />
        <li>
          <a href="#">
            <i className="material-icons">power_settings_new</i>
            <span>Log out</span>
          </a>
        </li>
      </ul>
    );
  }
}

export default UserMenu;
