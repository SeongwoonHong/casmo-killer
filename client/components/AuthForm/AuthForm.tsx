import React, { FunctionComponent, useState } from 'react';
import { IAuthForm } from 'interfaces';
import { AuthSocial, AuthLocal } from 'components';
import cx from 'classnames';


const AuthForm:FunctionComponent<IAuthForm.IProps> = ({
  mode,
  loginInputs,
  signupInputs,
  setEmail,
  setPassword,
  authOnClick,
}) => {
  return (
    <form className="AuthForm" onSubmit={authOnClick}>
      <div className="auth-social-text">
        소셜 {mode === 'login' ? '로그인' : '가입'}
      </div>
      <hr />
      <div className="AuthSocial-wrapper">
        <AuthSocial />
      </div>
      <hr />
      <div className="AuthLocal-wrapper">
        <AuthLocal
          mode={mode}
          inputs={mode === 'login' ? loginInputs : signupInputs}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      <button className="authform-button">
        { mode === 'login' ? '로그인' : '가입신청' }
      </button>
      </div>
    </form>
  );
};

export { AuthForm };
