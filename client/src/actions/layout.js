import * as types from './types';

export const toggleMenu = () => {
  return {
    type: types.TOGGLE_MAIN_MENU
  };
};

export const toggleSubMenu = (payload = null) => {
  return {
    type: types.TOGGLE_SUB_MENU,
    payload
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

export const toggleLoginModal = () => {
  return {
    type: types.TOGGLE_LOGIN_MODAL
  };
};

export const updateBreakPoint = (breakPoint) => {
  return (dispatch) => {

    if (breakPoint === 'lg') {
      dispatch(toggleSubMenu(false));
    } else if (breakPoint === 'xl') {
      dispatch(toggleSubMenu(true));
    }

    dispatch({
      type: types.UPDATE_BREAK_POINT,
      breakPoint
    });

  };
};
