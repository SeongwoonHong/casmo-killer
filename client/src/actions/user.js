import axios from 'axios';

import * as storage from 'sharedUtils/storage';
import * as types from './types';

import { resetAuthState } from './auth';

export const loginSuccess = (payload) => {
  return (dispatch) => {
    dispatch({
      type: types.LOGIN_SUCCESS,
      payload
    });
    dispatch(resetAuthState());
  };
};

export const logout = () => {
  return (dispatch) => {
    axios
      .post('/api/user/logout')
      .then(() => {
        storage.remove('ckUser');
        dispatch({
          type: types.LOGOUT
        });
      })
      .catch(err => console.error(err));
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
