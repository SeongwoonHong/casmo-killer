import * as types from './types';

export const toggleMenu = (payload = null) => {
  return {
    type: types.TOGGLE_MAIN_MENU,
    payload
  };
};

export const updateBreakPoint = (payload) => {
  return (dispatch, getState) => {

    const { layout } = getState();

    if (layout.breakPoint !== 'xl' && payload === 'xl') {
      dispatch(toggleMenu(true));
    } else if (layout.breakPoint === 'xl' && payload !== 'xl') {
      dispatch(toggleMenu(false));
    }

    dispatch({
      type: types.UPDATE_BREAK_POINT,
      payload
    });

  };
};

export const toggleUserDropdown = (payload = null) => {
  return {
    type: types.TOGGLE_USER_DROPDOWN,
    payload
  };
};
