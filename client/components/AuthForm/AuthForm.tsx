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
        return 'LOGIN';
      case 'signup':
        return 'SIGNUP';
      case 'signupRequest':
        return 'SIGNUP REQUEST';
      default:
        break;
    }
  }

  return (
    <form className="AuthForm" onSubmit={authOnClick}>
      {
        mode !== 'signup' && (
          <>
            <hr />
            <div className="AuthSocial-wrapper">
              <AuthSocial
                mode={mode}
              />
            </div>
          </>
        )
      }
      { mode !== 'signup' && <div className="auth-form-or">OR</div> }
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
