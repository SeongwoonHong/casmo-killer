import React from 'react';
import { useDispatch } from 'react-redux';
import { login as loginAction } from 'store/modules/auth';
import { Container, AuthFormContainer } from 'components';
import { useForm, formValidate } from 'utils';

const login = (props) => {
  const { values, errors, handleChange, handleSubmit } = useForm({
    email: '',
    password: '',
  }, formValidate, login);
  const loginInputs = [
    {
      id: 'email',
      placeholder: 'Email Address',
      type: 'text',
      value: values.email,
      name: 'email',
      onChange: handleChange,
    },
    {
      id: 'password',
      placeholder: 'Password',
      type: 'password',
      value: values.password,
      name: 'password',
      onChange: handleChange
    },
  ];
  const dispatch = useDispatch();

  function login() {
    const { email, password } = values;

    dispatch(loginAction(email, password));
  }

  return (
    <AuthFormContainer
      mode="login"
      loginInputs={loginInputs}
      authOnClick={handleSubmit}
      errors={errors}
    />
  );
};

export default Container('Damso - Login', 'login')(login);
