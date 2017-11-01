import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import './MainMenu.scss';

const mainMenuItems = [
  { name: 'WE', link: '/test1', icon: 'home' },
  { name: 'ARE', link: '/test2', icon: 'explore' },
  { name: 'KILLING', link: '/test3', icon: 'email' },
  { name: 'CASMO', link: '/test4', icon: 'shopping_cart' },
  { name: 'HAHAHA', link: '/test5', icon: 'search' }
];
class MainMenu extends Component {
  render() {
    return (
      <div id="main-menu" className={classnames({ expanded: this.props.menu.isExpanded })}>
        <div
          onClick={this.props.toggleMenu}
          role="button"
          tabIndex={0}
          onKeyDown={this.props.toggleMenu}
        >
          <div className="logo">
            <span />
          </div>
          <p className="menu-text">MENU</p>
        </div>
        <hr />
        <ul className="menu-item">
          {
            mainMenuItems.map((menu) => {
              return (
                <li key={menu.name}>
                  <Link to={`${this.props.menu.isExpanded ? menu.link : '#'}`}>
                    <i className="material-icons">{ menu.icon }</i>
                    <p className="menu-item-text">{ menu.name }</p>
                  </Link>
                </li>
              );
            })
          }
        </ul>
        <i className="material-icons info">sentiment_very_satisfied</i>
      </div>
    );
  }
}

export default MainMenu;
