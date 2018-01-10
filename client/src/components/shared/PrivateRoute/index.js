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
        onEnter(props.location.pathname);
        return <Redirect to="/user/auth/login" />;
      }}
    />
  );

};

export default PrivateRoute;
