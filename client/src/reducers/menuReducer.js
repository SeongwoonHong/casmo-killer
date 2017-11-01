import * as types from '../actions/types';

const initialState = {
  menu: {
    isExpanded: false
  }
};

export default function (state = initialState.menu, action) {
  switch (action.type) {
    case types.TOGGLE_MAINMENU:
      return {
        ...state,
        isExpanded: !state.isExpanded
      };
    default:
      return state;
  }
}
