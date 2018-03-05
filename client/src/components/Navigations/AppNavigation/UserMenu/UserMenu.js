/* eslint no-unused-vars: 0 */
import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

import './UserMenu.scss';

import MenuContainer from '../shared/MenuContainer';

import UserDropdownBtn from './UserDropdownBtn';
import UserDropdown from './UserDropdown';

class UserMenu extends Component {

  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(e) {
    if (this.props.active) {
      this.props.toggleUserMenu(false);
    }
  }

  render() {

    const {
      active, user, currentRoute, toggleUserMenu, logout
    } = this.props;

    return (
      <MenuContainer
        active={ active }
        className="User-menu"
        onClose={ () => toggleUserMenu(false) }>
        <UserDropdownBtn
          active={ active }
          isLoggedIn={ user.isLoggedIn }
          displayName={ user.displayName }
          avatar={ user.avatar }
          level={ user.level }
          toggleUserMenu={ toggleUserMenu } />
        <UserDropdown
          active={ active }
          isLoggedIn={ user.isLoggedIn}
          currentRoute={ currentRoute }
          onLogout={ logout }
          toggleUserMenu={ toggleUserMenu } />
      </MenuContainer>
    );

  }

}

export default onClickOutside(UserMenu);
