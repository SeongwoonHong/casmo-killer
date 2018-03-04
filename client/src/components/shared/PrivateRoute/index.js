import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({
  path, component: Component, isLoggedIn, onEnter
}) => {

  return (
    <Route
      path={ path }
      render={ (props) => {
        if (isLoggedIn) {
          return <Component {...props} />;
        }
        onEnter('Please log in to continue');
        return (
          <Redirect to={{
            pathname: '/user/auth/login',
            state: {
              from: props.location.pathname
            }
          }} />
        );
      }}
    />
  );

};

export default PrivateRoute;
