import React from 'react';
import cx from 'classnames';

const CloseButton = ({ className, onClick }) => {
  return (
    <div
      className={cx('CloseButton', className)}
      onClick={onClick}
    />
  );
};

export { CloseButton };
