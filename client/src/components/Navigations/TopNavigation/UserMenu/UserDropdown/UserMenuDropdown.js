import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './UserMenuDropdown.scss';

class UserMenuDropdown extends Component {

  render() {

    return (
      <ul className="teal lighten-5 dropdown-content">
        <li className="notification">
          <NavLink
            to="/"
            className="teal-text text-darken-4">
            <i className="material-icons">notifications</i>
            <span>Notifications</span>
            <span className="notification-badge">
              N
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            className="teal-text text-darken-4">
            <i className="material-icons">dashboard</i>
            <span>My Board</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            className="teal-text text-darken-4">
            <i className="material-icons">account_circle</i>
            <span>Profiles</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            className="teal-text text-darken-4">
            <i className="material-icons">settings</i>
            <span>Settings</span>
          </NavLink>
        </li>
        <li className="divider" />
        <li>
          <a
            role="button"
            tabIndex={ 0 }
            onClick={ this.props.logout }
            onKeyDown={ () => {
            } }
            className="teal-text text-darken-4">
            <i className="material-icons">power_settings_new</i>
            <span>Log out</span>
          </a>
        </li>
      </ul>
    );

  }

}

export default UserMenuDropdown;
