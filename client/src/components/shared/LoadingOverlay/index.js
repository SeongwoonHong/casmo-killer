import React from 'react';
import PropTypes from 'prop-types';

import LoadingCircle from '../LoadingCircle';
import './LoadingOverlay.scss';

const LoadingOverlay = (props) => {
  if (props.isVisible) {
    return (
      <div
        className="Loading-overlay"
        style={ { backgroundColor: props.overlayColor } }>
        <LoadingCircle
          size={ props.circleSize }
          color={ props.circleColor } />
      </div>
    );
  }
  return null;
};

LoadingOverlay.propTypes = {
  isVisible: PropTypes.bool,
  overlayColor: PropTypes.string,
  circleSize: PropTypes.string,
  circleColor: PropTypes.string
};

LoadingOverlay.defaultProps = {
  isVisible: true,
  overlayColor: 'rgba(0,0,0,.75)',
  circleSize: '#fff',
  circleColor: '#26a69a'
};

export default LoadingOverlay;
