import React from 'react';
import PropTypes from 'prop-types';

import './PlainBtn.scss';

const PlainBtn = (props) => {

  return (
    <button
      className={ `btn plain-btn ${props.disabled ? 'disabled' : ''}` }
      disabled={ props.disabled }
      onClick={ (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.onClick();
      } }>
      { props.children }
    </button>
  );

};

PlainBtn.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

PlainBtn.defaultProps = {
  onClick: () => {},
  disabled: false
};

export default PlainBtn;
