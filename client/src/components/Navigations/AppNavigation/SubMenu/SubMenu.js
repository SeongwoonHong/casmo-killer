import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './SubMenu.scss';

class SubMenu extends Component {

  render() {

    const { parent, items } = this.props;

    const MenuLinks = (routes) => {
      return routes.map((route) => {
        return (
          <li key={ route.name }>
            <NavLink
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
        <ul>
          { MenuLinks(items) }
        </ul>
      </div>
    );

  }

}

export default SubMenu;
