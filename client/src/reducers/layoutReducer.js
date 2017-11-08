import * as types from '../actions/types';

const initialState = {
  layout: {
    isMainMenuVisible: false,
    isSubMenuVisible: false,
    isUserMenuVisible: false,
    isSearchFormVisible: false
  }
};

export default function (state = initialState.layout, action) {
  switch (action.type) {
    case types.TOGGLE_SEARCH_FORM:
      return Object.assign({}, state, {
        isSearchFormVisible: !state.isSearchFormVisible
      });

    case types.TOGGLE_SUB_MENU:
      return Object.assign({}, state, {
        isSubMenuVisible: !state.isSubMenuVisible
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
