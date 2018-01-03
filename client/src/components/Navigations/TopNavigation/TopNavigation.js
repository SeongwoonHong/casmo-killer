import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PlainBtn from 'sharedComponents/PlainBtn';

import './TopNavigation.scss';

import SearchForm from '../SearchForm/SearchForm';
import UserMenu from './UserMenu';
import UserDropdown from './UserDropdown/UserMenuDropdown';

class TopNavigation extends Component {

  render() {

    return (
      <header className="teal darken-4 z-depth-2 top-main-nav">
        <PlainBtn onClick={ this.props.toggleMenu }>
          <i className="material-icons">
            dehaze
          </i>
        </PlainBtn>
        <h1>
          <Link to="/" className="teal-text text-lighten-5">
            CK BOARD
          </Link>
        </h1>
        <SearchForm styleClass="dt" />
        <UserMenu />
        {
          this.props.layout.isUserDropdownOpen
            ? (
              <UserDropdown
                isLoggedIn={ this.props.user.isLoggedIn }
                logout={ this.props.logout } />
            )
            : null
        }
      </header>
    );

  }

}

export default TopNavigation;
