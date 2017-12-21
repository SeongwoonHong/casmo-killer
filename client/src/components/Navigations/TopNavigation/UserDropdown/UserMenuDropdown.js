import React from 'react';
import { Link } from 'react-router-dom';

import PlainBtn from 'sharedComponents/PlainBtn';

import './UserMenuDropdown.scss';

const UserMenuDropdown = (props) => {

  if (props.user.isLoggedIn) {
    return (
      <ul className="dropdown-content logged-in">
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
          <PlainBtn onClick={ props.logout }>
            <i className="material-icons">power_settings_new</i>
            <span>Log out</span>
          </PlainBtn>
        </li>
      </ul>
    );
  }

  return (
    <ul className="dropdown-content">
      <li>
        <PlainBtn onClick={ () => props.openAuthModal() }>
          <i className="material-icons">person</i>
          <span>Log In</span>
        </PlainBtn>
      </li>
      <li className="divider" />
      <li>
        <PlainBtn onClick={ () => props.openAuthModal('register') }>
          <i className="material-icons">person_add</i>
          <span>Sign Up</span>
        </PlainBtn>
      </li>
    </ul>
  );

};

export default UserMenuDropdown;
