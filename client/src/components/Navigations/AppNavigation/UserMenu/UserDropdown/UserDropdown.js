/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
import React, { Component } from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import './UserDropdown.scss';

class UserDropdown extends Component {

  render() {

    const {
      active, isLoggedIn, currentRoute, onLogout
    } = this.props;

    if (isLoggedIn) {
      return (
        <ul
          className={ classnames('User-dropdown main-menu', {
            active
          }) }
          onClick={ () => {
            setTimeout(() => {
              this.props.toggleUserMenu(false);
            });
          } }>
          <li className="notification">
            <NavLink to="/user/notifications">
              <i className="material-icons">notifications</i>
              <span>Notifications</span>
              <span className="notification-badge">N</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/dashboard">
              <i className="material-icons">dashboard</i>
              <span>My Board</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/settings">
              <i className="material-icons">settings</i>
              <span>My Account</span>
            </NavLink>
          </li>
          <li className="divider" />
          <li>
            <a
              role="button"
              tabIndex={ 0 }
              onKeyDown={ () => {} }
              onClick={ () => onLogout() }>
              <i className="material-icons">power_settings_new</i>
              <span>Log out</span>
            </a>
          </li>
        </ul>
      );
    }

    return (
      <ul
        className={ classnames('User-dropdown main-menu', {
          active
        }) }
        onClick={ () => {
          setTimeout(() => {
            this.props.toggleUserMenu(false);
          });
        } }>
        <li>
          <NavLink to={{
            pathname: '/user/auth/login',
            state: {
              from: currentRoute
            }
          }}>
            <i className="material-icons">person</i>
            <span>Log In</span>
          </NavLink>
        </li>
        <li className="divider" />
        <li>
          <NavLink to={{
            pathname: '/user/auth/signup',
            state: {
              from: currentRoute
            }
          }}>
            <i className="material-icons">person_add</i>
            <span>Sign Up</span>
          </NavLink>
        </li>
      </ul>
    );

  }

}

export default UserDropdown;
