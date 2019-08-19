import React, { FunctionComponent } from 'react';
import { IAuthLocal } from 'interfaces';

const AuthLocal:FunctionComponent<IAuthLocal.IProps> = ({ mode, inputs, errors }) => {
  return (
    <div className="AuthLocal">
      <div className="authlocal-body">
        {
          inputs.map((input) => {
            return (
              <div
                className="authlocal-input-container"
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
