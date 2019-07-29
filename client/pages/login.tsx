import React from 'react';
import { Container, AuthFormContainer } from 'components';

const login = props => {
  return (
    <Container title="Damso Login">
      <AuthFormContainer
        mode="login"
      />
    </Container>
  );
};

export default login;
