import * as types from './types';

export const openAuthModal = (authType = 'login') => {
  return {
    type: types.OPEN_AUTH_MODAL,
    authType
  };
};

export const redirectToRegister = () => {
  return {
    type: types.REDIRECT_TO_REGISTER
  };
};

export const setUserForRegister = (payload) => {
  return {
    type: types.SET_USER_FOR_REGISTER,
    payload
  };
};

export const redirectToLogin = () => {
  return {
    type: types.REDIRECT_TO_LOGIN
  };
};

export const startAuthProcess = () => {
  return {
    type: types.START_AUTH_PROCESS
  };
};

export const stopAuthProcess = () => {
  return {
    type: types.STOP_AUTH_PROCESS
  };
};

export const closeAuthModal = () => {
  return {
    type: types.CLOSE_AUTH_MODAL
  };
};
