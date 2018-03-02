import * as types from '@actions/types';

export const initialState = {
  auth: {
    strategy: null,
    email: null,
    password: null,
    displayName: null,
    avatar: null,
    socialId: null,
    socialToken: null,
    redirectUrl: '/',
    verificationToken: null,
    message: ''
  }
};

export default function (state = initialState.auth, action) {

  switch (action.type) {

    case types.REGISTER_REDIRECT_URL:
      return Object.assign({}, state, {
        redirectUrl: action.payload
      });

    case types.REGISTER_REDIRECT_MESSAGE:
      return Object.assign({}, state, {
        message: action.payload
      });

    case types.CLEAR_REDIRECT_URL:
      return Object.assign({}, state, {
        redirectUrl: initialState.auth.redirectUrl,
        message: initialState.auth.message
      });

    case types.SET_USER_FOR_REGISTER:
      return Object.assign({}, state, {
        strategy: action.payload.strategy || state.strategy,
        email: action.payload.email || state.email,
        displayName: action.payload.displayName
          ? action.payload.displayName.replace(/\s/g, '')
          : state.displayName,
        avatar: action.payload.avatar || state.avatar,
        socialId: action.payload.socialId || state.socialId,
        socialToken: action.payload.socialToken || state.socialToken
      });

    case types.RESET_AUTH_STATE:
      return Object.assign({}, initialState.auth, {
        redirectUrl: state.redirectUrl
      });

    default:
      return state;

  }

}
