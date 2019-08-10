import React, { FunctionComponent, useState } from 'react';
import { IAuthFormContainer } from 'interfaces';
import cx from 'classnames';
import Link from 'next/link';
import { AuthForm } from 'components';

const AuthFormContainer: FunctionComponent<IAuthFormContainer.IProps> = ({
  mode,
  loginInputs,
  signupInputs,
  authOnClick,
  errors,
}) => {
  return (
    <div className="AuthFormContainer">
      {
        mode !== 'signup' && (
          <div className="authform-mode">
            <Link href="/login">
              <div className={cx('authform-mode-text', { active: mode === 'login' })}>Login</div>
            </Link>
            <Link href="/signup">
              <div className={cx('authform-mode-text', { active: mode === 'signupRequest' })}>Signup</div>
            </Link>
          </div>
        )
      }
      <div className="AuthForm-Wrapper">
        <AuthForm
          mode={mode}
          loginInputs={loginInputs}
          signupInputs={signupInputs}
          authOnClick={authOnClick}
          errors={errors}
        />
      </div>
    </div>
  );
};

export { AuthFormContainer };
