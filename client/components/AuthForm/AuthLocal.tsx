import React, { FunctionComponent } from 'react';
import { IAuthLocal } from 'interfaces';
import { Button } from 'components';
import cx from 'classnames';

const AuthLocal:FunctionComponent<IAuthLocal.IProps> = ({ mode, inputs, errors }) => {
  return (
    <div className="AuthLocal">
      <div className="authlocal-body">
        {
          inputs.map((input) => {
            return (
              <div
                className={cx('authlocal-input-container', mode)}
                key={input.id}
              >
                <input
                  className={`${input.id}-input authlocal-input`}
                  placeholder={input.placeholder}
                  onChange={input.onChange}
                  value={input.value}
                  name={input.id}
                  type={input.type || 'text'}
                />
                {
                  mode == 'signup' && input.id === 'email' && (
                    <>
                      <Button
                        className="email-verify-button"
                        onClick={input.sendVerificationCode}
                        type="button"
                      >
                        Send verification code
                      </Button>
                    </>
                  )
                }
                <div className="authlocal-error">
                  {
                    errors[input.id] && errors[input.id]
                  }
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export { AuthLocal };
