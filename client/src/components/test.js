import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';

const Test = (props: Props) => {
  const { AuthStore } = props;
  useEffect(() => {
    AuthStore.getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!AuthStore.user) {
    return  null;
  }

  return (
    <div>
      <div>username = {AuthStore.user.username}</div>
      <div>displayName = {AuthStore.user.displayName}</div>
      <div>thumbnail = {AuthStore.user.thumbnail}</div>
      <button onClick={AuthStore.test}>test fuck</button>
    </div>
  );
};

export default inject('AuthStore')(observer(Test));
