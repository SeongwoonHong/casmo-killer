import * as types from '../actions/types';

const initialState = {
  auth: {
    isOpen: false,
    isLoading: false,
    strategy: null,
    email: null,
    password: null,
    displayName: null,
    avatar: null,
    social: {
      id: null,
      accessToken: null
    }
  }
};

export default function (state = initialState.auth, action) {

  switch (action.type) {

    case types.OPEN_AUTH_MODAL:
      return Object.assign({}, state, {
        isOpen: true
      });

    case types.CLOSE_AUTH_MODAL:
      return initialState.auth;

    case types.START_AUTH_PROCESS:
      return Object.assign({}, state, {
        isLoading: true
      });

    case types.STOP_AUTH_PROCESS:
      return Object.assign({}, state, {
        isLoading: false
      });

    case types.SET_USER_FOR_REGISTER:
      return Object.assign({}, state, {
        isOpen: false,
        isLoading: false,
        strategy: action.payload.strategy || state.strategy,
        email: action.payload.email || state.email,
        displayName: action.payload.displayName.replace(/\s/g, '') || state.displayName,
        avatar: action.payload.avatar || state.avatar,
        social: action.payload.social
          ? {
            id: action.payload.social.id,
            accessToken: action.payload.social.accessToken
          }
          : state.social
      });

    default:
      return state;

  }

}
