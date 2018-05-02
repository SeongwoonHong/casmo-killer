import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TopNavBtn from '../TopNavBtn';
import AppTitle from '../AppTitle';

import './MenuContainer.scss';

const UserMenu = ({
  className, active, onClose, children
}) => {

  return (
    <div className={ classnames(`Menu-container ${className}`, {
      active
    })}>
      <div className="Menu-container__header">
        <TopNavBtn
          icon="close"
          classPrefix="Menu-container"
          onClick={ onClose } />
        <AppTitle />
      </div>
      <div className="Menu-container__body">
        { children }
      </div>

    </div>
  );

};

UserMenu.propTypes = {
  className: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};

export default UserMenu;
