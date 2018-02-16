/* eslint react/no-find-dom-node: 0 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import './UserMenu.scss';

import MenuContainer from '../shared/MenuContainer';

class UserMenu extends Component {

  constructor(props) {

    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.clickToToggle = this.clickToToggle.bind(this);

  }

  componentDidMount() {

    document.addEventListener('click', this.toggleDropdown, false);
    document.addEventListener('touchend', this.toggleDropdown, false);

  }

  componentWillUnmount() {

    document.removeEventListener('click', this.toggleDropdown, false);
    document.removeEventListener('touchend', this.toggleDropdown, false);

  }

  toggleDropdown(event) {

    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      if (this.props.active && (this.props.layout.breakPoint === 'lg' || this.props.layout.breakPoint === 'xl')) {
        setTimeout(() => {
          this.props.toggleUserMenu(false);
        });
      }
    }

  }

  clickToToggle(event) {

    if (event.type === 'mousedown' && event.button !== 0) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    this.props.toggleUserMenu();

  }

  render() {

    const { active, user, toggleUserMenu, logout } = this.props;

    const MenuLinks = (isLoggedIn) => {

      if (isLoggedIn) {
        return (
          <ul className="main-menu">
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
                onClick={ () => logout() }>
                <i className="material-icons">power_settings_new</i>
                <span>Log out</span>
              </a>
            </li>
          </ul>
        );
      }

      return (
        <ul className="main-menu">
          <li>
            <NavLink to="/user/auth/login">
              <i className="material-icons">person</i>
              <span>Log In</span>
            </NavLink>
          </li>
          <li className="divider" />
          <li>
            <NavLink to="/user/auth/signup">
              <i className="material-icons">person_add</i>
              <span>Sign Up</span>
            </NavLink>
          </li>
        </ul>
      );

    };

    return (
      <MenuContainer
        active={ active }
        className="User-menu"
        onClose={ () => toggleUserMenu(false) }>
        <button
          type="button"
          className={ classnames('top-nav-btn user-profile', {
            active,
            loggedIn: user.isLoggedIn
          }) }
          onClick={ () => toggleUserMenu() }>
          {
            user.isLoggedIn &&
            user.displayName
              ? (
                <div className="user-info">
                  <div className="user-avatar">
                    {
                      user.avatar
                        ? (
                          <img
                            src={ user.avatar }
                            alt={ user.displayName } />
                        )
                        : (
                          <span>
                            { user.displayName[0] }
                          </span>
                        )
                    }
                  </div>
                  <div className="user-username">
                    <span>{ user.displayName }</span>
                    <span>{ user.level || 'newbie' }</span>
                  </div>
                  <i className="material-icons">
                    arrow_drop_down
                  </i>
                </div>
              )
              : (
                <i className="material-icons">
                  person_outline
                </i>
              )
          }
        </button>
        { MenuLinks(user.isLoggedIn) }
      </MenuContainer>
    );

  }

}

export default UserMenu;
