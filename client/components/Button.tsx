import React, { FunctionComponent } from 'react';
import cx from 'classnames';
import { IButton } from 'interfaces';

const Button:FunctionComponent<IButton.IProps> = ({ className, onClick, children }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={cx('button', className)}
    >
      {children}
    </button>
  );
};

export { Button };
