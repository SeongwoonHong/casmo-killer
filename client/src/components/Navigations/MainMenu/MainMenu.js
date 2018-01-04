import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import classnames from 'classnames';

import './MainMenu.scss';

import SearchForm from '../SearchForm/SearchForm';

import { MainMenuRoutes } from '../../../routers';

class MainMenu extends Component {

  render() {

    const { layout } = this.props;

    const MenuLinks = (routes) => {
      return routes.map((route) => {
        if (route.name && route.icon) {
          return (
            <li key={ route.name }>
              <NavLink
                to={ route.path }
                onClick={ this.props.toggleMenu }>
                <i className="material-icons">
                  { route.icon }
                </i>
                <span>{ route.name }</span>
              </NavLink>
              <ul className="sub-menu">
                {
                  route.children
                    ? route.children.map(child => (
                      <li key={ child.name }>
                        <NavLink
                          exact
                          to={ route.path + child.path }
                          onClick={ this.props.toggleMenu }>
                          { child.name }
                        </NavLink>
                      </li>
                    ))
                    : null
                }
              </ul>
            </li>
          );
        }
        return null;
      });
    };

    return ([
      <div
        role="button"
        tabIndex={ 0 }
        className={ classnames('Main-menu-overlay', {
          active: layout.isMainMenuVisible
        })}
        onClick={ this.props.toggleMenu }
        onKeyDown={ () => {} }
      />,

      <nav className={ classnames('Main-menu', {
        toggled: layout.isMainMenuVisible,
        folded: !layout.isSubMenuVisible
      }) }>

        <button
          type="button"
          className="top-nav-btn"
          onClick={ this.props.toggleMenu }>
          <i className="material-icons">
            close
          </i>
        </button>

        <div className="main-menu-wrapper">

          <div className="main-menu-header">
            <h1>
              <Link to="/">
                CK BOARD
              </Link>
            </h1>
          </div>

          <button
            className="top-nav-btn"
            onClick={ this.props.toggleSubMenu }>
            <i className="material-icons">
              {
                layout.isSubMenuVisible
                  ? 'chevron_left'
                  : 'chevron_right'
              }
            </i>
          </button>

          <div className="main-menu-body">
            <SearchForm styleClass="mb" />
            <ul className="main-menu">
              { MenuLinks(MainMenuRoutes) }
            </ul>
          </div>

          <div className="main-menu-footer">
            <span>{ new Date().getFullYear() } copy the fuck right</span>
          </div>

        </div>

      </nav>
    ]);

  }

}

export default MainMenu;
