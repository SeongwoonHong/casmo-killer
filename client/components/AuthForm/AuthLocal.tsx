import React, { FunctionComponent } from 'react';
import { IAuthLocal } from 'interfaces';

const AuthLocal:FunctionComponent<IAuthLocal.IProps> = ({ mode, inputs }) => {
  return (
    <div className="AuthLocal">
      <div className="authlocal-header">
        이메일 { mode === 'login' ? '로그인' : '가입'}
      </div>
      <div className="authlocal-body">
        {
          inputs.map((input) => {
            return (
              <div
                className="authlocal-input"
                key={input.id}
              >
                <input
                  className="email-input"
                  placeholder={input.placeholder}
                  onChange={input.onChange}
                  value={input.value}
                  type={input.type || 'text'}
                />
                <div className="authlocal-label">{input.label}</div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export { AuthLocal };
