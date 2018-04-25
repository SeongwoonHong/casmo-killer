import React from 'react';
import classnames from 'classnames';

import TopNavBtn from '../TopNavBtn';
import AppTitle from '../AppTitle';

import './MenuContainer.scss';

const UserMenu = (props) => {

  return (
    <div className={ classnames(`Menu-container ${props.className}`, {
      active: props.active
    })}>
      <div className="Menu-container__header">
        <TopNavBtn
          icon="close"
          classPrefix="Menu-container"
          onClick={ props.onClose } />
        <AppTitle />
      </div>
      <div className="Menu-container__body">
        { props.children }
      </div>

    </div>
  );

};

export default UserMenu;
