import * as types from '@actions/types';

export const initialState = {
  error: {
    errorTitle: '',
    errorMsg: '',
    redirectUrl: '/'
  }
};

export default function (state = initialState.error, action) {

  switch (action.type) {

    case types.SET_ERROR_STATE:
      return Object.assign({}, state, {
        errorTitle: (action.payload !== null && action.payload.errorTitle) || state.errorTitle,
        errorMsg: (action.payload !== null && action.payload.errorMsg) || state.errorMsg,
        redirectUrl: (action.payload !== null && action.payload.redirectUrl) || state.redirectUrl
      });

    default:
      return state;

  }

}
