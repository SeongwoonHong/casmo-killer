import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { toast } from 'react-toastify';

const PrivateRoute = ({
  path, component: Component, isLoggedIn, onEnter, componentProps
}) => {

  return (
    <Route
      path={ path }
      render={ (props) => {

        if (isLoggedIn) {
          return <Component {...props} {...componentProps} />;
        }

        toast.error('Please log in to continue', {
          position: toast.POSITION_TOP_RIGHT
        });

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
