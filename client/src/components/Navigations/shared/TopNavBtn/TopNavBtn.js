import React from 'react';

import './TopNavBtn.scss';

const TopNavBtn = ({
  className, classPrefix, icon, onClick, children
}) => {

  return (
    <button
      type="button"
      className={ `Top-nav-btn ${classPrefix}__btn ${className}`}
      onClick={ onClick }>
      {
        children ||
        <i className={ `Top-nav-btn__icons material-icons ${classPrefix}__icon`}>
          { icon }
        </i>
      }
    </button>
  );

};

export default TopNavBtn;
