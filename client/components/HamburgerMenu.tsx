import React, { FunctionComponent } from 'react';
import cx from 'classnames';
import { IHamburgerMenu } from 'interfaces';

const HamburgerMenu:FunctionComponent<IHamburgerMenu.IProps> = ({ onClick, isOpened }) => {
  return (
    <div
      className={cx('HamburgerMenu',  { isOpened })}
      onClick={onClick}
    >
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
    </div>
  );
};

export default HamburgerMenu;
