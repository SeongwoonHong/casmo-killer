import React, { FunctionComponent } from 'react';
import cx from 'classnames';
import { IButton } from 'interfaces';

const Button:FunctionComponent<IButton.IProps> = ({ className, onClick, children }) => {
  return (
    <button
      type="submit"
      className={cx('button', className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { Button };
