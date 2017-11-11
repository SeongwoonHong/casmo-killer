import * as types from './types';

export const updateBreakPoint = (breakPoint) => {
  return {
    type: types.UPDATE_BREAK_POINT,
    breakPoint
  };
};

export const toggleMenu = () => {
  return {
    type: types.TOGGLE_MAIN_MENU
  };
};

export const toggleUserMenu = () => {
  return {
    type: types.TOGGLE_USER_MENU
  };
};

export const toggleSearchForm = () => {
  return {
    type: types.TOGGLE_SEARCH_FORM
  };
};

export const userLoggedIn = () => {
  return {
    type: types.USER_LOGGED_IN
  };
};

export const userLoggedOut = () => {
  return {
    types: types.USER_LOGGED_OUT
  };
};
