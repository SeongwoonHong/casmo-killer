import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './MainMenu.scss';

import MenuContainer from '../../shared/MenuContainer';

class MainMenu extends Component {

  render() {

    const { menus, active, toggleMenu } = this.props;

    const MenuLinks = (routes) => {
      return routes.map((route) => {
        if (route.name && route.icon) {
          return (
            <li
              key={ route.name }
              className="Main-menu__list__items">
              <NavLink
                className="Main-menu__list__items__links"
                to={ route.path }>
                <i className="Main-menu__list__items__links__icons material-icons">
                  { route.icon }
                </i>
                <span className="Main-menu__list__items__links__text">
                  { route.name }
                </span>
              </NavLink>
              <ul className="Main-menu__list__items__sub sub-menu">
                {
                  route.children
                    ? route.children.map(child => (
                      <li
                        key={ child.name }
                        className="Main-menu__list__items__sub__items">
                        <NavLink
                          className="Main-menu__list__items__sub__items__links"
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
        <ul className="Main-menu__list">
          { MenuLinks(menus) }
        </ul>
      </MenuContainer>
    );

  }

}

export default MainMenu;
