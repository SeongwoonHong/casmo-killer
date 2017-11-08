import React, { Component } from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import './MainMenu.scss';

import SubMenu from './SubMenu/SubMenu';

const mainMenuItems = [
  { name: '커뮤니티', link: '/test1', icon: 'home' },
  { name: '맛집', link: '/test2', icon: 'explore' },
  { name: 'Q&A', link: '/test3', icon: 'email' },
  { name: '정보', link: '/test4', icon: 'shopping_cart' }
];

class MainMenu extends Component {
  render() {
    const { layout } = this.props;
    return (
      <nav className={ classnames('side-main-nav', {
        active: layout.isMainMenuVisible
      }) }>
        <div className="side-main-nav-wrapper">
          <div className="side-main-nav-header">
            <a
              className="btn"
              role="button"
              tabIndex={ 0 }
              onClick={ this.props.toggleSearchForm }
              onKeyDown={() => {}}>
              <i className="material-icons">
                search
              </i>
            </a>
            <h1>
              <NavLink to="/">CK BOARD</NavLink>
            </h1>
            <form className={ classnames('search-form-dt', {
              active: layout.isSearchFormVisible && layout.isMainMenuVisible
            }) }>
              <input type="text" placeholder="Search" />
            </form>
          </div>
          <div className={ classnames('side-main-nav-body', {
             multiColumns: layout.isSubMenuVisible
          })}>
            <ul className="main-menu">
              <a
                className="btn"
                role="button"
                tabIndex={ 0 }
                onClick={ this.props.toggleMenu }
                onKeyDown={ () => {} }>
                <i className="material-icons">
                  {
                    layout.isMainMenuVisible ? 'chevron_left' : 'chevron_right'
                  }
                </i>
              </a>
              {
                mainMenuItems.map((menu, index) => {
                  return (
                    <li key={ menu.name }>
                      <a
                        role="button"
                        tabIndex={ 0 }
                        className={ classnames({
                          testing: layout.isSubMenuVisible && index === 0
                        })}
                        onClick={ this.props.toggleSubMenu }
                        onKeyDown={ () => {} }>
                        <i className="material-icons">{ menu.icon }</i>
                        {
                          !layout.isSubMenuVisible || layout.isMainMenuVisible
                            ? <span>{ menu.name }</span>
                            : ''
                        }
                      </a>
                    </li>
                  );
                })
              }
            </ul>
            {
              layout.isSubMenuVisible ? <SubMenu /> : ''
            }
          </div>
        </div>
      </nav>
    );
  }
}

export default MainMenu;
