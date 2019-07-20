import React, { useEffect, FunctionComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from 'components';
import { ITest1 } from 'interfaces';

const Test: FunctionComponent<ITest1.IProps> = (props) => {
  const { authStore } = props;

  useEffect(() => {
    authStore.getUser();
  }, []);

  if (!authStore.user) {
    return  null;
  }

  return (
    <Container title="test">
      <div>username = {authStore.user.username}</div>
      <div>displayName = {authStore.user.displayName}</div>
      <div>thumbnail = {authStore.user.thumbnail}</div>
      <button onClick={() => authStore.test()}>test fuck</button>
    </Container>
  );
};

export default inject('authStore')(observer(Test));
