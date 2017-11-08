import * as types from './types';

export const toggleMenu = () => {
  return {
    type: types.TOGGLE_MAIN_MENU
  };
};

export const toggleSubMenu = () => {
  return {
    type: types.TOGGLE_SUB_MENU
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

