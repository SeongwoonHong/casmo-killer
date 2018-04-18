import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './TopNavigation.scss';

class TopNavigation extends Component {

  render() {

    const { toggleMenu, toggleUserMenu } = this.props;

    return (
      <header className="Top-navigation nav-headers">
        <div className="component-row">
          <button
            type="button"
            className="top-nav-btn"
            onClick={ toggleMenu }>
            <i className="material-icons">
              dehaze
            </i>
          </button>
          <h1>
            <Link to="/community">
              CK BOARD
            </Link>
          </h1>
          <button
            type="button"
            className="top-nav-btn"
            onClick={ toggleUserMenu }>
            <i className="material-icons">
              person_outline
            </i>
          </button>
        </div>
      </header>
    );

  }

}

export default TopNavigation;
