import axios from 'axios';
import * as types from './types';

export const toggleMenu = () => {
  return {
    type: types.TOGGLE_MAINMENU
  };
};
export const login = () => {
  return {
    type: types.LOGIN_REQUEST
  };
};
export const loginFailure = () => {
  return {
    type: types.LOGIN_FAILURE
  };
};
export const loginSuccess = (email) => {
  return {
    type: types.LOGIN_SUCCESS,
    email
  };
};
export const loginRequest = (email, password) => async (dispatch) => {
  try {
    dispatch(login());
    await axios.get('/api/login', { email, password });
    dispatch(loginSuccess(email));
  } catch (e) {
    console.error(e);
    dispatch(loginFailure());
  }
};
