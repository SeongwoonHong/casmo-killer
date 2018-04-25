import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import classnames from 'classnames';

import './AppNavigation.scss';

import { MainMenuRoutes } from '../../../routers';

import MainMenu from './MainMenu';
import UserMenu from './UserMenu';
import SubMenu from './SubMenu';

class AppNavigation extends Component {

  componentDidUpdate(prevProps) {

    const {
      location, layout, closeAllMenu
    } = this.props;

    if (location !== prevProps.location && layout.breakPoint !== 'xl') {
      closeAllMenu();
    }

  }

  render() {

    const {
      location, user, layout, closeAllMenu, toggleMenu, toggleUserMenu, logout
    } = this.props;

    const SubMenus = (routes) => {
      return routes.map((route) => {
        if (route.children) {
          return (
            <Route
              exact={ route.exact }
              key={ route.name || 'root' }
              path={ route.path }
              render={props => (
                <SubMenu
                  { ...props }
                  parent={ route.path }
                  items={ route.children } />
              ) }
            />
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
        className={ classnames('App-navigation__overlay', {
          active: layout.isMainMenuVisible || layout.isUserMenuVisible
        })}
        onClick={ closeAllMenu }
        onKeyDown={ () => {} }
      />,

      <nav
        key={ 1 }
        className="App-navigation">
        <div className="App-navigation__row component-row">
          <MainMenu
            active={ layout.isMainMenuVisible }
            menus={ MainMenuRoutes }
            toggleMenu={ toggleMenu } />
          <UserMenu
            active={ layout.isUserMenuVisible }
            user={ user }
            layout={ layout }
            currentRoute={ location.pathname }
            toggleUserMenu={ toggleUserMenu }
            logout={ logout } />
        </div>
        <Switch>
          { SubMenus(MainMenuRoutes) }
        </Switch>
      </nav>
    ]);

  }

}

export default AppNavigation;
