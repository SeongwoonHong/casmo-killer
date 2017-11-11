import * as types from '../actions/types';

const initialState = {
  user: {
    isLoggedIn: true
  }
};

export default function (state = initialState.user, action) {

  switch (action.type) {

    case types.USER_LOGGED_IN:
      return Object.assign({}, state, {
        isLoggedIn: true
      });

    case types.USER_LOGGED_OUT:
      return Object.assign({}, state, {
        isLoggedIn: false
      });

    default:
      return state;

  }

}
