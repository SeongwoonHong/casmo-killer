import React, { FunctionComponent } from 'react';
import cx from 'classnames';
import { IButton } from '~interfaces';

const Button:FunctionComponent<IButton.IProps> = ({ className, onClick, children, type, disabled = false}) => {
  return (
    <button
      type={type || 'submit'}
      className={cx('button', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { Button };
