import React from 'react';
import { Container, AuthFormContainer } from 'components';

const signup = props => {
  return (
    <Container title="Damso signup">
      <AuthFormContainer
        mode="signup"
      />
    </Container>
  );
};

export default signup;
