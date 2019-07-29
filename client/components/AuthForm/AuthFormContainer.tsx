import React, { FunctionComponent } from 'react';
import { IAuthFormContainer } from 'interfaces';
import cx from 'classnames';
import Link from 'next/link';
import { AuthForm } from 'components';

const AuthFormContainer: FunctionComponent<IAuthFormContainer.IProps> = props => {
  return (
    <div className="AuthFormContainer">
      <div className="authform-mode">
        <Link href="/login">
          <div className={cx('authform-mode-text', { active: props.mode === 'login' })}>Login</div>
        </Link>
        <Link href="/signup">
          <div className={cx('authform-mode-text', { active: props.mode === 'signup' })}>Signup</div>
        </Link>
      </div>
      <div className="AuthForm-Wrapper">
        <AuthForm mode={props.mode} />
      </div>
    </div>
  );
};

export { AuthFormContainer };
