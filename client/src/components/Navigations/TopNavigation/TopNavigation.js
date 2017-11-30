import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './TopNavigation.scss';

import SearchForm from '../SearchForm/SearchForm';
import UserMenu from './UserMenu';

class TopNavigation extends Component {

  render() {

    return (
      <header className="teal darken-4 z-depth-2 top-main-nav">
        <a
          role="button"
          tabIndex={ 0 }
          onClick={ this.props.toggleMenu }
          onKeyDown={ () => {} }
          className="btn teal darken-4 hide-in-dt">
          <i className="material-icons teal-text-text-lighten-5">
            dehaze
          </i>
        </a>
        <h1>
          <Link to="/" className="teal-text text-lighten-5">
            CK BOARD
          </Link>
        </h1>
        <SearchForm styleClass="dt" />
        <UserMenu />
      </header>
    );

  }

}

export default TopNavigation;
