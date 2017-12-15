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

export const openUserInfoModal = (userInfo) => {
  return {
    type: types.OPEN_USERINFO_MODAL,
    userInfo
  };
};

export const closeUserInfoModal = () => {
  return {
    type: types.CLOSE_USERINFO_MODAL
  };
};
