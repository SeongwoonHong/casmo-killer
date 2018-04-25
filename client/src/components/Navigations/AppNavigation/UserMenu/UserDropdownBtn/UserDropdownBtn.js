import React from 'react';

import TopNavBtn from '../../../shared/TopNavBtn';

import './UserDropdownBtn.scss';

const UserDropdownBtn = ({
  isLoggedIn, displayName, avatar, level, toggleUserMenu
}) => {

  return (
    <TopNavBtn
      className={
        isLoggedIn
        ? 'User-dropdown-btn__btn--loggedIn'
        : ''
      }
      classPrefix="User-dropdown-btn"
      icon="person_outline"
      onClick={ toggleUserMenu }>
      {
        isLoggedIn && displayName
          ? (
            <div className="User-dropdown-btn__btn__row">
              <div className="User-dropdown-btn__btn__avatar">
                {
                  avatar
                  ? (
                    <img
                      className="User-dropdown-btn__btn__avatar__img"
                      src={ avatar }
                      alt={ displayName } />
                  )
                  : (
                    <span className="User-dropdown-btn__btn__avatar__text">
                      { displayName[0] }
                    </span>
                  )
                }
              </div>
              <div className="User-dropdown-btn__btn__username">
                <span className="User-dropdown-btn__btn__username__text">
                  { displayName }
                </span>
                <span className="User-dropdown-btn__btn__username__level">
                  { level || 'newbie' }
                </span>
              </div>
              <i className="User-dropdown-btn__btn__icon material-icons">
                arrow_drop_down
              </i>
            </div>
        )
        : null
      }
    </TopNavBtn>
  );

};

export default UserDropdownBtn;
