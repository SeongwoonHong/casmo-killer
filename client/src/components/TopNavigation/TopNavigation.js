import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import './TopNavigation.scss';

import UserMenu from './UserMenu';
import SearchForm from '../SearchForm/SearchForm';

class TopNavigation extends Component {
  render() {
    return (
      <header className="z-depth-2 top-main-nav">
        <a
          role="button"
          tabIndex={ 0 }
          className={ classnames('btn', 'hide-in-dt', {
            active: this.props.layout.isMainMenuVisible
          }) }
          onClick={ this.props.toggleMenu }
          onKeyDown={ () => {} }>
          <i className="material-icons">
            {
              this.props.layout.isMainMenuVisible ? 'close' : 'dehaze'
            }
          </i>
        </a>
        <h1>
          <NavLink to="/">CK BOARD</NavLink>
        </h1>
        <SearchForm styleClass="dt" />
        <div className="user-menu-toggle">
          <a className="btn hide-in-mobile">
            <i className="material-icons">
              notifications_none
            </i>
            <span className="notification-badge">4</span>
          </a>
          <a
            role="button"
            tabIndex={ 0 }
            className="btn"
            onBlur={ () => {
              // if (this.props.layout.isUserMenuVisible) {
              //   this.props.toggleUserMenu();
              // }
            } }
            onClick={ this.props.toggleUserMenu }
            onKeyDown={ () => {
            } }>
            <i className="material-icons">
              {
                this.props.layout.isUserMenuVisible ? 'person_outline' : 'person'
              }
            </i>
          </a>
          <UserMenu />
        </div>
      </header>
    );
  }
}

export default TopNavigation;
