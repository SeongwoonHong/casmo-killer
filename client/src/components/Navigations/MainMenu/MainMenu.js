import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import classnames from 'classnames';

import './MainMenu.scss';

import SearchForm from '../SearchForm/SearchForm';

import { MainMenuRoutes } from '../../../routers';

class MainMenu extends Component {

  componentDidUpdate(prevProps) {

    const { location, layout, toggleMenu } = this.props;

    if (location !== prevProps.location && layout.breakPoint !== 'xl') {
      toggleMenu(false);
    }

  }

  render() {

    const { layout, toggleMenu } = this.props;

    // TODO: hide the main menu when it's login or signup page?
    // console.log(location.pathname.indexOf('/user/auth') > -1);

    const MenuLinks = (routes) => {
      return routes.map((route) => {
        if (route.name && route.icon) {
          return (
            <li key={ route.name }>
              <NavLink
                to={ route.path }>
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
                          to={ route.path + child.path }>
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
        key={ 0 }
        role="button"
        tabIndex={ 0 }
        className={ classnames('Main-menu-overlay', {
          active: layout.isMainMenuVisible
        })}
        onClick={ () => toggleMenu() }
        onKeyDown={ () => {} }
      />,

      <nav
        key={ 1 }
        className={ classnames('Main-menu', {
          active: layout.isMainMenuVisible
        }) }>

        <div className="main-menu-wrapper">

          <div className="main-menu-header navigation-headers">
            <button
              type="button"
              className="top-nav-btn"
              onClick={ toggleMenu }>
              <i className="material-icons">
                close
              </i>
            </button>
            <h1>
              <Link to="/">
                CK BOARD
              </Link>
            </h1>
          </div>

          <div className="main-menu-body">
            <SearchForm styleClass="mb" />
            <ul className="main-menu">
              <li>
                <NavLink exact to="/">
                  <i className="material-icons">home</i>
                  <span>Home</span>
                </NavLink>
              </li>
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
