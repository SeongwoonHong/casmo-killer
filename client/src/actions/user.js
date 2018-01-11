import axios from 'axios';

import * as storage from 'sharedUtils/storage';
import * as types from './types';

import { resetAuthState } from './auth';
import { toggleAppLoading } from './layout';

export const loginSuccess = (payload, shouldReset = false) => {

  return (dispatch) => {

    dispatch({
      type: types.LOGIN_SUCCESS,
      payload
    });

    if (shouldReset) {
      dispatch(resetAuthState());
    }

  };

};

export const logout = (isLoggedIn = true) => {

  return async (dispatch) => {

    dispatch(toggleAppLoading(true));

    if (isLoggedIn) {

      try {

        const { status } = await axios.post('/api/user/logout');

        if (status === 204) {
          dispatch({
            type: types.LOGOUT
          });
        }

      } catch (error) {
        console.error(error);
      }

    } else {

      dispatch({
        type: types.LOGOUT
      });

    }

    storage.remove('ckUser');

    setTimeout(() => {
      dispatch(toggleAppLoading(false));
    }, 1000);

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
