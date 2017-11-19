import React, { Component } from 'react';
import { Route, Switch, NavLink, Link } from 'react-router-dom';
import classnames from 'classnames';

import './MainMenu.scss';

import SearchForm from '../SearchForm/SearchForm';

import { MainMenuRoutes } from '../../../routers';

class MainMenu extends Component {

  render() {

    const { layout } = this.props;

    const MenuLinks = (routes) => {
      return routes.map((route) => {
        if (route.name) {
          return (
            <li key={ route.name }>
              <NavLink
                to={ route.path }>
                <i className="material-icons">
                  { route.icon }
                </i>
                <span>{ route.name }</span>
              </NavLink>
            </li>
          );
        }
        return null;
      });
    };

    const SubMenus = (routes) => {
      return routes.map(route => (
        <Route
          key={ route.name || 'root' }
          exact={ route.exact }
          path={ route.path }
          items={ route.children }
          component={ route.subMenu }
        />
      ));
    };

    return (
      <nav className={ classnames('side-main-nav', {
        toggled: layout.isMainMenuVisible
      }) }>
        <div className="teal darken-3 side-main-nav-wrapper">
          <div className="side-main-nav-header">
            <a
              className="btn"
              role="button"
              tabIndex={ 0 }
              onClick={ this.props.toggleSearchForm }
              onKeyDown={ () => {
              } }>
              <i className="material-icons">
                search
              </i>
            </a>
            <h1>
              <Link
                to="/"
                className="teal-text text-lighten-5">
                CK BOARD
              </Link>
            </h1>
            <SearchForm styleClass={ classnames('mb', {
              active: layout.isSearchFormVisible
            }) } />
          </div>
          <a
            className="btn submenu-toggle"
            role="button"
            tabIndex={ 0 }
            onClick={ this.props.toggleMenu }
            onKeyDown={ () => {
            } }>
            <i className="material-icons">
              {
                layout.isMainMenuVisible
                  ? 'chevron_right'
                  : 'chevron_left'
              }
            </i>
          </a>
          <div className="side-main-nav-body">
            <ul className="main-menu">
              { MenuLinks(MainMenuRoutes) }
            </ul>
            <Switch>
              { SubMenus(MainMenuRoutes) }
            </Switch>
          </div>
        </div>
      </nav>
    );

  }

}

export default MainMenu;
