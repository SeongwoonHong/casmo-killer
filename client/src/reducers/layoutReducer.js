import * as types from '../actions/types';

const initialState = {
  layout: {
    breakPoint: '',
    isMainMenuVisible: false,
    isUserMenuVisible: false,
    isSearchFormVisible: false
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

    case types.TOGGLE_USER_MENU:
      return Object.assign({}, state, {
        isUserMenuVisible: !state.isUserMenuVisible
      });

    case types.TOGGLE_MAIN_MENU:
      return Object.assign({}, state, {
        isMainMenuVisible: !state.isMainMenuVisible
      });

    default:
      return state;

  }

}
