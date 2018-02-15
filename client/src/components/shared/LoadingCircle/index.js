import React from 'react';
import PropTypes from 'prop-types';

const LoadingCircle = (props) => {
  return (
    <div className={ `preloader-wrapper active ${props.size}`}>
      <div className="spinner-layer" style={ { borderColor: props.color } }>
        <div className="circle-clipper left">
          <div className="circle" />
        </div>
        <div className="gap-patch">
          <div className="circle" />
        </div>
        <div className="circle-clipper right">
          <div className="circle" />
        </div>
      </div>
    </div>
  );
};

LoadingCircle.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string
};

LoadingCircle.defaultProps = {
  size: '',
  color: '#26a69a'
};

export default LoadingCircle;
