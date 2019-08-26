import React, { useState } from 'react';
import { Container, AuthFormContainer, Modal } from 'components';
import { useDispatch } from 'react-redux';
import { signup as signupAction, requestSignup } from 'store/modules/auth';
import { useForm, formValidate } from 'utils';

const signup = () => {
  const [isModalOpend, setIsModalOpened] = useState(false);
  const dispatch = useDispatch();

  const signupErrorInitialValues = {
    email: '',
    password: '',
    passwordConfirm: '',
    displayName: '',
    verificationCode: '',
    avatar: '',
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    signupErrorInitialValues, 
    formValidate,
    signup); 
  
  const signupInputs = [
    {
      id: 'email',
      placeholder: 'Email Address',
      type: 'text',
      value: values.email,
      name: 'email',
      onChange: handleChange,
      sendVerificationCode,
    },
    {
      id: 'verificationCode',
      placeholder: 'Email Verification Code',
      value: values.verificationCode,
      name: 'verificationCode',
      onChange: handleChange
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
      id: 'passwordConfirm',
      placeholder: 'Password Confirm',
      type: 'password',
      value: values.passwordConfirm,
      name: 'passwordConfirm',
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
    const { email, password, displayName } = values;

    return dispatch(signupAction({ email, password, displayName }))
  }

  function sendVerificationCode() {
    const { email } = values;

    if (email.trim() && isEmailValid(email)) {
      requestSignup(email);
      toggleModal()
    }
  }

  function isEmailValid(email) {
    return !formValidate({ email }).email;
  }

  function toggleModal() {
    setIsModalOpened(!isModalOpend);
  }

  return (
    <>
      <AuthFormContainer
        mode={'signup'}
        signupInputs={signupInputs}
        authOnClick={handleSubmit}
        errors={errors}
      />
      <Modal
        isOpened={isModalOpend}
        onClose={toggleModal}
      >
        <h1>Verification code is sent</h1>
        <div>We've sent you a verification code via email.</div>
        <div>Please check your email and enter the code below</div>
      </Modal>
    </>
  );
};

export default Container('Damso - Signup', 'signup')(signup);
