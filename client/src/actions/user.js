import * as types from './types';

export const loginSuccess = (payload) => {
  return {
    type: types.LOGIN_SUCCESS,
    payload
  };
};

export const logout = () => {
  return {
    type: types.LOGOUT
  };
};
