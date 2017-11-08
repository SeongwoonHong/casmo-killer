import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './SubMenu.scss';

class SubMenu extends Component {
  render() {
    return (
      <div className="sub-menu">
        <h3>커뮤니티</h3>
        <ul>
          <li>
            <NavLink to="/">
              &middot; 모든 커뮤니티
            </NavLink>
          </li>
          <li>
            <NavLink to="/">
              &middot; 나의 커뮤니티
            </NavLink>
          </li>
          <li>
            <NavLink to="/">
              &middot; 즐겨찾기
            </NavLink>
          </li>
          <li>
            <NavLink to="/">
              &middot; 자유게시판
            </NavLink>
          </li>
          <li>
            <NavLink to="/">
              &middot; 장터
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default SubMenu;
