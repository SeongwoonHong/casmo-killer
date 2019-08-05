import React, { FunctionComponent } from 'react';
import cx from 'classnames';
import { IButton } from 'interfaces';

const Button:FunctionComponent<IButton.IProps> = ({ className, onClick, children }) => {
  return (
    <div
      className={cx('button', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { Button };
