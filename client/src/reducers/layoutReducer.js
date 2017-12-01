import * as types from '../actions/types';
import breakPoint from '../utils/breakPoint';

const initialState = {
  layout: {
    breakPoint: breakPoint(window.innerWidth),
    isMainMenuVisible: false,
    isSubMenuVisible: breakPoint(window.innerWidth) === 'xl',
    isUserMenuVisible: false,
    isSearchFormVisible: false,
    isLoginModalOpen: false,
  }
};

export default function (state = initialState.layout, action) {

  switch (action.type) {

    case types.UPDATE_BREAK_POINT:
      return Object.assign({}, state, {
        breakPoint: action.breakPoint
      });

    case types.TOGGLE_SEARCH_FORM:
      return Object.assign({}, state, {
        isSearchFormVisible: !state.isSearchFormVisible
      });

    case types.TOGGLE_SUB_MENU:
      return Object.assign({}, state, {
        isSubMenuVisible: action.payload !== null ? action.payload : !state.isSubMenuVisible
      });

    case types.TOGGLE_USER_MENU:
      return Object.assign({}, state, {
        isUserMenuVisible: !state.isUserMenuVisible
      });

    case types.TOGGLE_MAIN_MENU:
      return Object.assign({}, state, {
        isMainMenuVisible: !state.isMainMenuVisible
      });

    case types.TOGGLE_LOGIN_MODAL:
      return Object.assign({}, state, {
        isLoginModalOpen: !state.isLoginModalOpen
      });

    default:
      return state;

  }

}
