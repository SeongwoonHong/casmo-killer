import * as types from './types';

export const toggleMenu = (payload = null) => {
  return {
    type: types.TOGGLE_MAIN_MENU,
    payload
  };
};

export const updateBreakpoint = (payload) => {
  return {
    type: types.UPDATE_BREAK_POINT,
    payload
  };
};

export const toggleUserMenu = (payload = null) => {
  return {
    type: types.TOGGLE_USER_MENU,
    payload
  };
};

export const toggleAppLoading = (payload = null) => {
  return {
    type: types.TOGGLE_APP_LOADING,
    payload
  };
};
