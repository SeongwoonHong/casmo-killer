import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './SubMenu.scss';

class SubMenu extends Component {

  render() {

    const { parent, items } = this.props;

    const MenuLinks = (routes) => {
      return routes.map((route) => {
        return (
          <li
            className="Sub-menu__list__items"
            key={ route.name }>
            <NavLink
              className="Sub-menu__list__items__links"
              exact
              to={ parent + route.path }>
              { route.name }
            </NavLink>
          </li>
        );
      });
    };

    return (
      <div className="Sub-menu">
        <ul className="Sub-menu__list component-row">
          { MenuLinks(items) }
        </ul>
      </div>
    );

  }

}

export default SubMenu;
