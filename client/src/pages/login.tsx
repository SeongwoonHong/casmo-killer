import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction } from '~store/modules/auth';
import { Container, AuthFormContainer } from '~components';
import Router from 'next/router';
import { useForm, formValidate } from '~utils';
import { toast } from 'react-toastify';

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
  let toastId = 'toast-login';
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (user) {
      Router.push('/trending');
    }
  }, [user]);

  function login() {
    const { email, password } = values;

    return dispatch(loginAction(email, password))
      .then(loginSuccessCB)
      .catch(loginFailCB)
  }

  function loginFailCB() {
    if (!toast.isActive(toastId)) {
      return toast.error('Login Failed. Please try it again', {
        toastId
      });
    }
  }

  function loginSuccessCB() {
    return toast.success('Login Success!')
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
