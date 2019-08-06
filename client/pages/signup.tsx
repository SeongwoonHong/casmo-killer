import React, { useState } from 'react';
import { Container, AuthFormContainer } from 'components';
import { inject, observer } from 'mobx-react';

const signup = ({ authStore }) => {
  const [email, setEmail] = useState('');
  const signupInputs = [
    {
      id: 'email',
      placeholder: '이메일 주소',
      type: 'text',
      label: '로그인에 사용될 이메일입니다.',
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
  ];

  function signup(e) {
    e.preventDefault();
    authStore.signup(email);
  }

  return (
    <Container title="Damso - signup" id="signup">
      <AuthFormContainer
        mode="signup"
        setEmail={setEmail}
        signupInputs={signupInputs}
        authOnClick={signup}
      />
    </Container>
  );
};

export default inject('authStore')(observer(signup));
