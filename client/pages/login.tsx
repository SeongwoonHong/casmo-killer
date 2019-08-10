import React, { useState } from 'react';
import { Container, AuthFormContainer } from 'components';
import { inject, observer } from 'mobx-react';
import { useForm, formValidate } from 'utils';

const login = ({ authStore }) => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const { values, errors, handleChange, handleSubmit } = useForm({
    email: '',
    password: '',
  }, formValidate, login);
  const loginInputs = [
    {
      id: 'email',
      placeholder: '이메일 주소',
      type: 'text',
      label: '로그인에 사용될 이메일입니다.',
      value: values.email,
      name: 'email',
      onChange: handleChange,
    },
    {
      id: 'password',
      placeholder: '비밀번호',
      type: 'password',
      label: '로그인에 사용될 이메일입니다.',
      value: values.password,
      name: 'password',
      onChange: handleChange
    },
  ];

  function login() {
    const { email, password } = values;

    authStore.login({
      email,
      password,
    });
  }

  return (
    <Container title="Damso - Login" id="login">
      <AuthFormContainer
        mode="login"
        loginInputs={loginInputs}
        authOnClick={handleSubmit}
        errors={errors}
      />
    </Container>
  );
};

export default inject('authStore')(observer(login));
