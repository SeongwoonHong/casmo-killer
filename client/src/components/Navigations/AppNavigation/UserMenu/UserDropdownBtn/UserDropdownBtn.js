import React from 'react';
import classnames from 'classnames';

import './UserDropdownBtn.scss';

const UserDropdownBtn = ({
  active, isLoggedIn, displayName, avatar, level, toggleUserMenu
}) => {

  return (
    <button
      type="button"
      className={ classnames('User-dropdown-btn top-nav-btn', {
        active,
        loggedIn: isLoggedIn
      }) }
      onClick={ () => toggleUserMenu() }>
      {
        isLoggedIn && displayName
          ? (
            <div className="user-info">
              <div className="user-avatar">
                {
                  avatar
                    ? (
                      <img
                        src={ avatar }
                        alt={ displayName } />
                    )
                    : (
                      <span>
                        { displayName[0] }
                      </span>
                    )
                }
              </div>
              <div className="user-username">
                <span>{ displayName }</span>
                <span>{ level || 'newbie' }</span>
              </div>
              <i className="material-icons">
                arrow_drop_down
              </i>
            </div>
          )
          : (
            <i className="material-icons">
              person_outline
            </i>
          )
      }
    </button>
  );

};

export default UserDropdownBtn;
