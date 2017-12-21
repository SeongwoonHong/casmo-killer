import * as types from './types';

export const openAuthModal = () => {
  return {
    type: types.OPEN_AUTH_MODAL
  };
};

export const closeAuthModal = () => {
  return {
    type: types.CLOSE_AUTH_MODAL
  };
};

export const startAuthProcess = () => {
  return {
    type: types.START_AUTH_PROCESS
  };
};

export const stopAuthProceess = () => {
  return {
    type: types.STOP_AUTH_PROCESS
  };
};

export const setUserForRegister = (payload) => {
  return {
    type: types.SET_USER_FOR_REGISTER,
    payload
  };
};
