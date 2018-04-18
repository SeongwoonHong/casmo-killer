import React from 'react';
import PropTypes from 'prop-types';

import './LoadingCircle.scss';

const LoadingCircle = (props) => {
  return (
    <div className="Loading-circle" style={ props.style } />
  );
};

LoadingCircle.propTypes = {
  style: PropTypes.object
};

LoadingCircle.defaultProps = {
  style: {}
};

export default LoadingCircle;
