import * as types from './types';

export const registerRedirectMessage = (payload) => {
  return {
    type: types.REGISTER_REDIRECT_MESSAGE,
    payload
  };
};

export const setUserForRegistration = (userInfo) => {
  return {
    type: types.SET_USER_FOR_REGISTER,
    payload: userInfo
  };
};

export const resetAuthState = () => {
  return {
    type: types.RESET_AUTH_STATE
  };
};
