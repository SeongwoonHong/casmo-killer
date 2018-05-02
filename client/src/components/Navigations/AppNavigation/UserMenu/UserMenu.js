/* eslint no-unused-vars: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import './UserMenu.scss';

import MenuContainer from '../../shared/MenuContainer';

import UserDropdownBtn from './UserDropdownBtn';
import UserDropdown from './UserDropdown';

export class UserMenu extends Component {

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

UserMenu.propTypes = {
  active: PropTypes.bool.isRequired,
  user: PropTypes.any.isRequired,
  currentRoute: PropTypes.string.isRequired,
  toggleUserMenu: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default onClickOutside(UserMenu);
