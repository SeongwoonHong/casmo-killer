import * as types from '../actions/types';

const initialState = {
  auth: {
    isProcessing: false,
    isRegistering: false,
    type: null,
    strategy: null,
    email: null,
    password: null,
    username: null,
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
        type: action.authType
      });

    case types.CLOSE_AUTH_MODAL:
      return initialState.auth;

    case types.REDIRECT_TO_REGISTER:
      return Object.assign({}, state, {
        type: 'register'
      });

    case types.REDIRECT_TO_LOGIN:
      return Object.assign({}, state, {
        type: 'login'
      });

    case types.START_AUTH_PROCESS:
      return Object.assign({}, state, {
        isProcessing: true
      });

    case types.STOP_AUTH_PROCESS:
      return Object.assign({}, state, {
        isProcessing: false
      });

    case types.SET_USER_FOR_REGISTER:
      return Object.assign({}, state, {
        isProcessing: false,
        isRegistering: true,
        strategy: action.payload.strategy || state.strategy,
        email: action.payload.email || state.email,
        password: action.payload.password || state.password,
        username: action.payload.username || state.username,
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
