import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './MainMenu.scss';

import MenuContainer from '../shared/MenuContainer';

class MainMenu extends Component {

  render() {

    const { menus, active, toggleMenu } = this.props;

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

    return (
      <MenuContainer
        active={ active }
        className="Main-menu"
        onClose={ () => toggleMenu(false) }>
        <ul className="main-menu">
          <li>
            <NavLink exact to="/">
              <i className="material-icons">home</i>
              <span>Home</span>
            </NavLink>
          </li>
          { MenuLinks(menus) }
        </ul>
      </MenuContainer>
    );

  }

}

export default MainMenu;
