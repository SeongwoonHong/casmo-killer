import * as types from '../actions/types';

const initialState = {
  auth: {
    isLoggedIn: false,
    currentUser: null
  }
};

export default function (state = initialState.auth, action) {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return {
        ...state,
        isLoggedIn: true
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        currentUser: action.email
      };
    case types.LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        currentUser: null
      };
    case types.REGISTER_REQUEST:
      return {
        ...state
      };
    case types.REGISTER_SUCCESS:
      return {
        ...state
      };
    case types.REGISTER_FAILURE:
      return {
        ...state
      };
    default:
      return state;
  }
}
