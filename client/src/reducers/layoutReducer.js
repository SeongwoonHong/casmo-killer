import * as types from '../actions/types';
import breakPoint from '../utils/breakPoint';

const initialState = {
  layout: {
    breakPoint: breakPoint(window.innerWidth),
    isMainMenuVisible: false,
    isUserDropdownOpen: false,
    isAppLoading: true,
  }
};

export default function (state = initialState.layout, action) {

  switch (action.type) {

    case types.UPDATE_BREAK_POINT:
      return Object.assign({}, state, {
        breakPoint: action.payload
      });

    case types.TOGGLE_MAIN_MENU:
      return Object.assign({}, state, {
        isMainMenuVisible: action.payload !== null
          ? action.payload
          : !state.isMainMenuVisible
      });

    case types.TOGGLE_USER_DROPDOWN:
      return Object.assign({}, state, {
        isUserDropdownOpen: action.payload !== null
          ? action.payload
          : !state.isUserDropdownOpen
      });

    case types.TOGGLE_APP_LOADING:
      return Object.assign({}, state, {
        isAppLoading: action.payload !== null
          ? action.payload
          : !state.isAppLoading
      });

    default:
      return state;

  }

}
