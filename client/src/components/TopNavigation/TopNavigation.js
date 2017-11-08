import React, { Component } from 'react';

import classnames from 'classnames';

import './TopNavigation.scss';

import UserMenu from '../UserMenu';

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
          <a href="#">CK BOARD</a>
        </h1>
        <form className="search-form-dt">
          <i className="material-icons">
            search
          </i>
          <input type="text" placeholder="Search" />
        </form>
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
