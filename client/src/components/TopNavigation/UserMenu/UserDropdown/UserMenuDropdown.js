import React from 'react';
import { NavLink } from 'react-router-dom';

import './UserMenuDropdown.scss';

const NotificationBadge = (showNotification) => {
  if (showNotification) {
    return (
      <li>
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
    );
  }
  return null;
};

const UserMenuDropdown = ({ showNotification }) => {
  return (
    <ul className="teal lighten-5 dropdown-content">
      { NotificationBadge(showNotification) }
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
        <NavLink
          to="/"
          className="teal-text text-darken-4">
          <i className="material-icons">power_settings_new</i>
          <span>Log out</span>
        </NavLink>
      </li>
    </ul>
  );
};

export default UserMenuDropdown;
