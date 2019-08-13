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
      placeholder: '이메일 주소',
      type: 'text',
      label: '로그인에 사용될 이메일입니다.',
      value: values.email,
      name: 'email',
      onChange: handleChange,
    }
  ];
  const signupInputs = [
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
      label: '아무거나 입력 떄리세요',
      value: values.password,
      name: 'password',
      onChange: handleChange,
    },
    {
      id: 'displayName',
      placeholder: '닉네임',
      type: 'text',
      label: '아무거나 입력 때리세요',
      value: values.displayName,
      name: 'displayName',
      onChange: handleChange,
    },
    {
      id: 'avatar',
      placeholder: '아바타',
      type: 'file',
      label: '당신 면상입니다',
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
    <Container title="Damso - Signup" id="signup">
      {
        isLoading ? (
          <Loader />
        ) : (
          renderAuthFormContainer()
        )
      }
    </Container>
  );
};

export default withRouter(signup);
