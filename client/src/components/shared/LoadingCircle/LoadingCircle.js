import React from 'react';
import PropTypes from 'prop-types';

import './LoadingCircle.scss';

const LoadingCircle = (props) => {
  return (
    <div
      className={ `Loading-circle ${props.className}` }
      style={ props.style } />
  );
};

LoadingCircle.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
};

LoadingCircle.defaultProps = {
  className: '',
  style: {}
};

export default LoadingCircle;
