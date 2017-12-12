import * as types from '../actions/types';

const initialState = {
  user: {
    isLoggedIn: false,
    _id: null,
    username: null,
    avatar: null
  }
};

export default function (state = initialState.user, action) {

  switch (action.type) {

    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        _id: action.payload._id,
        username: action.payload.username,
        avatar: action.payload.avatar || null
      });

    case types.LOGOUT:
      return initialState.user;

    default:
      return state;

  }

}
