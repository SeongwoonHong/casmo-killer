import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import './MenuContainer.scss';

const UserMenu = (props) => {

  return (
    <div className={ classnames(`Menu-container ${props.className}`, {
      active: props.active
    })}>

      <div className="menu-header nav-headers">
        <button
          type="button"
          className="top-nav-btn"
          onClick={ () => props.onClose() }>
          <i className="material-icons">
            close
          </i>
        </button>
        <h1>
          <Link to="/">
            CK BOARD
          </Link>
        </h1>
      </div>

      <div className="menu-body">
        { props.children }
      </div>

    </div>
  );

};

export default UserMenu;
