import React, { FunctionComponent } from 'react';
import { IAuthForm } from 'interfaces';
import { AuthSocial, AuthLocal } from 'components';


const AuthForm:FunctionComponent<IAuthForm.IProps> = ({
  mode,
  loginInputs,
  signupInputs,
  authOnClick,
  errors,
}) => {
  function getButtonLabel() {
    switch (mode) {
      case 'login':
        return '로그인';
      case 'signup':
        return '회원가입';
      case 'signupRequest':
        return '가입신청';
      default:
        break;
    }
  }

  return (
    <form className="AuthForm" onSubmit={authOnClick}>
      {
        mode !== 'signup' && (
          <>
            <div className="auth-social-text">
              소셜 {mode === 'login' ? '로그인' : '가입'}
            </div>
            <hr />
            <div className="AuthSocial-wrapper">
              <AuthSocial />
            </div>
            <hr />
          </>
        )
      }
      <div className="AuthLocal-wrapper">
        <AuthLocal
          mode={mode}
          inputs={mode === 'login' ? loginInputs : signupInputs}
          errors={errors}
        />
      <button className="authform-button">
        { getButtonLabel() }
      </button>
      </div>
    </form>
  );
};

export { AuthForm };
