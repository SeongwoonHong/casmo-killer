import React from 'react';
import PropTypes from 'prop-types';

import './TopNavBtn.scss';

const TopNavBtn = ({
  className, classPrefix, icon, onClick, children
}) => {

  return (
    <button
      type="button"
      className={ `Top-nav-btn ${classPrefix}__btn ${className}`}
      onClick={ () => onClick() }>
      {
        children ||
        <i className={ `Top-nav-btn__icons material-icons ${classPrefix}__icon`}>
          { icon }
        </i>
      }
    </button>
  );

};

TopNavBtn.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
};

TopNavBtn.defaultProps = {
  className: '',
  classPrefix: '',
  icon: '',
  onClick: () => {},
  children: '',
};

export default TopNavBtn;
