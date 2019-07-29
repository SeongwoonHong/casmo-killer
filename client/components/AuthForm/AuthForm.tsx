import React, { FunctionComponent, useState } from 'react';
import { IAuthForm } from 'interfaces';
import { AuthSocial, AuthLocal } from 'components';
import cx from 'classnames';


const AuthForm:FunctionComponent<IAuthForm.IProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginInputs = [
    {
      id: 'email',
      placeholder: '이메일 주소',
      type: 'text',
      label: '로그인에 사용될 이메일입니다.',
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      id: 'password',
      placeholder: '비밀번호',
      type: 'password',
      label: '로그인에 사용될 이메일입니다.',
      value: password,
      onChange: (e) => setPassword(e.target.value),
    },
  ];
  const signupInputs = [
    {
      id: 'email',
      placeholder: '이메일 주소',
      label: '로그인에 사용될 이메일입니다.',
      value: email,
      onChange: (e) => setEmail(e.target.value)
    },
  ];

  function authOnClick(e) {
    e.preventDefault();

    if (mode === 'login') {
      console.log('login email, password ', email, password);
    } else {
      console.log('signup email ', email);
    }
  }

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
