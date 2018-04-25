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
          <li className="User-dropdown__items--notification">
            <NavLink
              className="User-dropdown__items__links"
              to="/user/notifications">
              <i className="User-dropdown__items__links__icons material-icons">
                notifications
              </i>
              <span className="User-dropdown__items__links__text">
                Notifications
              </span>
              <span className="notification-badge">N</span>
            </NavLink>
          </li>
          <li className="User-dropdown__items">
            <NavLink
              className="User-dropdown__items__links"
              to="/user/dashboard">
              <i className="User-dropdown__items__links__icons material-icons">
                dashboard
              </i>
              <span className="User-dropdown__items__links__text">
                My Board
              </span>
            </NavLink>
          </li>
          <li className="User-dropdown__items">
            <NavLink
              className="User-dropdown__items__links"
              to="/user/settings">
              <i className="User-dropdown__items__links__icons material-icons">
                settings
              </i>
              <span className="User-dropdown__items__links__text">
                My Account
              </span>
            </NavLink>
          </li>
          <li className="User-dropdown__items">
            <a
              className="User-dropdown__items__links"
              role="button"
              tabIndex={ 0 }
              onKeyDown={ () => {} }
              onClick={ () => onLogout() }>
              <i className="User-dropdown__items__links__icons material-icons">
                power_settings_new
              </i>
              <span className="User-dropdown__items__links__text">
                Log out
              </span>
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
        <li className="User-dropdown__items">
          <NavLink
            className="User-dropdown__items__links"
            to={{
              pathname: '/user/auth/login',
              state: {
                from: currentRoute
              }
            }}>
            <i className="User-dropdown__items__links__icons material-icons">
              person
            </i>
            <span className="User-dropdown__items__links__text">
              Log In
            </span>
          </NavLink>
        </li>
        <li className="User-dropdown__items">
          <NavLink
            className="User-dropdown__items__links"
            to={{
              pathname: '/user/auth/signup',
              state: {
                from: currentRoute
              }
            }}>
            <i className="User-dropdown__items__links__icons material-icons">
              person_add
            </i>
            <span className="User-dropdown__items__links__text">
              Sign Up
            </span>
          </NavLink>
        </li>
      </ul>
    );

  }

}

export default UserDropdown;
