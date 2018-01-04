import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './TopNavigation.scss';

import SearchForm from '../SearchForm/SearchForm';
import UserMenu from './UserMenu/UserMenu';
import UserDropdown from './UserDropdown/UserMenuDropdown';

class TopNavigation extends Component {

  render() {

    const {
      layout, user, toggleMenu, toggleUserDropdown, logout
    } = this.props;

    return (
      <header className="Top-navigation">
        <button
          type="button"
          className="top-nav-btn"
          onClick={ toggleMenu }>
          <i className="material-icons">
            dehaze
          </i>
        </button>
        <h1>
          <Link to="/">
            CK BOARD
          </Link>
        </h1>
        <SearchForm styleClass="dt" />
        <UserMenu
          user={ user }
          layout={ layout }
          toggleUserDropdown={ toggleUserDropdown } />
        {
          layout.isUserDropdownOpen
            ? (
              <UserDropdown
                isLoggedIn={ user.isLoggedIn }
                logout={ logout } />
            )
            : null
        }
      </header>
    );

  }

}

export default TopNavigation;
