import React from 'react';
import { Link } from 'react-router-dom';

import './UserMenuDropdown.scss';

const UserMenuDropdown = ({ isLoggedIn, logout }) => {

  if (isLoggedIn) {
    return (
      <ul className="User-menu-dropdown dropdown-content logged-in">
        <li className="notification">
          <Link to="/user/notifications">
            <i className="material-icons">notifications</i>
            <span>Notifications</span>
            <span className="notification-badge">N</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="material-icons">dashboard</i>
            <span>My Board</span>
          </Link>
        </li>
        <li>
          <Link to="/user/settings">
            <i className="material-icons">settings</i>
            <span>My Account</span>
          </Link>
        </li>
        <li className="divider" />
        <li>
          <a
            role="button"
            tabIndex={ 0 }
            onKeyDown={ () => {} }
            onClick={ logout }>
            <i className="material-icons">power_settings_new</i>
            <span>Log out</span>
          </a>
        </li>
      </ul>
    );
  }

  return (
    <ul className="User-menu-dropdown dropdown-content">
      <li>
        <Link to="/user/auth/login">
          <i className="material-icons">person</i>
          <span>Log In</span>
        </Link>
      </li>
      <li className="divider" />
      <li>
        <Link to="/user/auth/signup">
          <i className="material-icons">person_add</i>
          <span>Sign Up</span>
        </Link>
      </li>
    </ul>
  );

};

export default UserMenuDropdown;
