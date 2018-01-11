import * as types from '../actions/types';

const initialState = {
  user: {
    isLoggedIn: false,
    strategy: null,
    _id: null,
    email: null,
    displayName: null,
    avatar: null
  },
  userModalInfo: {
    _id: null,
    displayName: null,
    avatar: null
  }
};

export default function (state = initialState.user, action) {

  switch (action.type) {

    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        strategy: action.payload.strategy,
        _id: action.payload._id,
        email: action.payload.email,
        displayName: action.payload.displayName,
        avatar: action.payload.avatar || null
      });

    case types.LOGOUT:
      return initialState.user;

    case types.OPEN_USERINFO_MODAL:
      return Object.assign({}, state, {
        userModalInfo: {
          _id: action.userInfo._id,
          displayName: action.userInfo.displayName,
          avatar: action.userInfo.avatar
        }
      });
    case types.CLOSE_USERINFO_MODAL:
      return Object.assign({}, state, {
        userModalInfo: {
          _id: null,
          displayName: null,
          avatar: null
        }
      });

    default:
      return state;

  }

}
