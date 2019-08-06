import React, { useState } from 'react';
import { Container, AuthFormContainer } from 'components';
import { inject, observer } from 'mobx-react';

const login = ({ authStore }) => {
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

  function login(e) {
    e.preventDefault();
    authStore.login(email, password);
  }

  return (
    <Container title="Damso - Login" id="login">
      <AuthFormContainer
        mode="login"
        loginInputs={loginInputs}
        setEmail={setEmail}
        setPassword={setPassword}
        authOnClick={login}
      />
    </Container>
  );
};

export default inject('authStore')(observer(login));
