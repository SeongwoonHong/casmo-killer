import { setToken, removeToken } from '../utils/cookies';

import * as types from './types';

export const loginSuccess = (token) => {

  return (dispatch) => {

    setToken(token)
      .then((cookie) => {
        dispatch({
          type: types.LOGIN_SUCCESS,
          token: cookie
        });
      })
      .catch(() => {
        console.log('Failed to set the cookie for the token.');
      });

  };
};

export const logout = () => {

  return (dispatch) => {

    removeToken()
      .then(() => {
        dispatch({
          type: types.LOGOUT
        });
      });

  };

};
