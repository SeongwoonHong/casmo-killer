import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './SubMenu.scss';

class SubMenu extends Component {

  render() {

    const { match, title, items } = this.props;

    return (
      <div className="teal darken-4 sub-menu">
        <h3 className="teal-text text-lighten-1">{ title }</h3>
        <ul>
          {
            items
              ? items.map((item) => {
                return (
                  <li key={ item.name }>
                    <NavLink
                      exact
                      to={ match.path + item.path }
                      className="teal-text text-lighten-5">
                      <span>&#183;</span>
                      { item.name }
                    </NavLink>
                  </li>
                );
              })
              : null
          }
        </ul>
      </div>
    );

  }

}

export default SubMenu;
