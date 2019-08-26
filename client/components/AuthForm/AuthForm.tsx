import React, { FunctionComponent } from 'react';
import { IAuthForm } from 'interfaces';
import { AuthSocial, AuthLocal, Button } from 'components';


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
      <hr />
      <div className="AuthSocial-wrapper">
        <AuthSocial
          mode={mode}
        />
      </div>
      <div className="auth-form-or">OR</div>
      <div className="AuthLocal-wrapper">
        <AuthLocal
          mode={mode}
          inputs={mode === 'login' ? loginInputs : signupInputs}
          errors={errors}
        />
      <Button className="authform-button">
        { getButtonLabel() }
      </Button>
      </div>
    </form>
  );
};

export { AuthForm };
