import React from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import './UserMenu.scss';


const UserMenu = ({ active }) => {
  return (
    <ul className={ classnames('dropdown-content', 'user-menu-dropdown', { active })}>
      <li>
        <NavLink to="/">
          <i className="material-icons">dashboard</i>
          <span>My Board</span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/">
          <i className="material-icons">account_circle</i>
          <span>Profiles</span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/">
          <i className="material-icons">settings</i>
          <span>Settings</span>
        </NavLink>
      </li>
      <li className="divider" />
      <li>
        <NavLink to="/">
          <i className="material-icons">power_settings_new</i>
          <span>Log out</span>
        </NavLink>
      </li>
    </ul>
  );
};

export default UserMenu;
