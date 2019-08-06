import React, { FunctionComponent, useState } from 'react';
import { IAuthFormContainer } from 'interfaces';
import cx from 'classnames';
import Link from 'next/link';
import { AuthForm } from 'components';

const AuthFormContainer: FunctionComponent<IAuthFormContainer.IProps> = ({
  mode,
  loginInputs,
  signupInputs,
  setEmail,
  setPassword,
  authOnClick
}) => {
  return (
    <div className="AuthFormContainer">
      <div className="authform-mode">
        <Link href="/login">
          <div className={cx('authform-mode-text', { active: mode === 'login' })}>Login</div>
        </Link>
        <Link href="/signup">
          <div className={cx('authform-mode-text', { active: mode === 'signup' })}>Signup</div>
        </Link>
      </div>
      <div className="AuthForm-Wrapper">
        <AuthForm
          mode={mode}
          loginInputs={loginInputs}
          signupInputs={signupInputs}
          setEmail={setEmail}
          setPassword={setPassword}
          authOnClick={authOnClick}
        />
      </div>
    </div>
  );
};

export { AuthFormContainer };
