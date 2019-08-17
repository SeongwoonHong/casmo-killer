import React, { useState, useEffect } from 'react';
import { Container, AuthFormContainer, Loader } from 'components';
import { useDispatch } from 'react-redux';
import { withRouter } from 'next/router';
import { signup as signupAction } from 'store/modules/auth';
import { useForm, formValidate } from 'utils';

const signup = ({ router }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifiedToken, setIsVerifiedToken] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(router.query).length) {
      verifyToken();
    }
  }, [router.query]);

  const signupRequestErrorInitialValues = {
    email: '',
  };

  const signupErrorInitialValues = {
    email: '',
    password: '',
    displayName: '',
    avatar: '',
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    Object.keys(router.query).length ? signupErrorInitialValues : signupRequestErrorInitialValues, 
    formValidate,
    Object.keys(router.query).length ? signup : signupRequest); 
  
  async function verifyToken() {
    setIsLoading(true);

    const res = await new Promise((resolve) => setTimeout(resolve, 2000));

    // for now, it's always a verified token
    setIsVerifiedToken(true);

    setIsLoading(false);

    return res;
  }

  const emailInput = [
    {
      id: 'email',
      placeholder: 'Email Address',
      type: 'text',
      value: values.email,
      name: 'email',
      onChange: handleChange,
    }
  ];
  const signupInputs = [
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
      onChange: handleChange,
    },
    {
      id: 'displayName',
      placeholder: 'User Name',
      type: 'text',
      value: values.displayName,
      name: 'displayName',
      onChange: handleChange,
    },
    {
      id: 'avatar',
      placeholder: 'Avatar',
      type: 'file',
      value: values.avatar,
      name: 'avatar',
      onChange: handleChange,
    },
  ];

  function signup() {
    console.log('signup ')
    const { email, password, displayName } = values;

    dispatch(signupAction({ email, password, displayName }))
  }

  function signupRequest() {
    setIsRequested(true);
  }

  function renderAuthFormContainer() {
    return isRequested ? (
      <div className="check-your-email">check your email brother</div>
    ) : (
      <AuthFormContainer
        mode={isVerifiedToken ? 'signup' : 'signupRequest'}
        signupInputs={isVerifiedToken ? signupInputs : emailInput}
        authOnClick={handleSubmit}
        errors={errors}
      />
    );
  }

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          renderAuthFormContainer()
        )
      }
    </>
  );
};

export default Container('Damso - Signup', 'signup')(withRouter(signup));
