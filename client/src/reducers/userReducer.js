import * as types from '../actions/types';

const initialState = {
  user: {
    isLoggedIn: false,
    strategy: null,
    _id: null,
    email: null,
    displayName: null,
    avatar: null,
    bookmarked: []
  },
  userModalInfo: {
    _id: null,
    displayName: null,
    avatar: null
  },
  activity: {
    status: 'INIT',
    data: [],
    error: null
  },
  activityPagination: {
    pageCount: 1
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
        avatar: action.payload.avatar || null,
        bookmarked: action.payload.bookmarked
      });

    case types.LOGOUT:
      return initialState.user;

    case types.REMOVE_USER:
      return Object.assign({}, initialState.user, {
        isLoggedIn: true,
      });

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
    case types.BOOKMARK_SUCCESS:
      return Object.assign({}, state, {
        bookmarked: action.payload.bookmarked
      });

    default:
      return state;

  }

}
