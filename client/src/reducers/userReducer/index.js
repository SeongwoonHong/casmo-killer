import * as types from '@actions/types';

export const initialState = {
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
    avatar: null,
    mode: null
  },
  tagsList: {
    status: 'INIT',
    data: [],
    error: null
  },
  isModalOpened: false
};

export default function (state = initialState, action) {

  switch (action.type) {

    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        user: {
          isLoggedIn: true,
          strategy: action.payload.strategy,
          _id: action.payload._id,
          email: action.payload.email,
          displayName: action.payload.displayName,
          avatar: action.payload.avatar || null,
          bookmarked: action.payload.bookmarked
        }
      });

    case types.LOGOUT:
      return Object.assign({}, state, {
        user: initialState.user
      });

    case types.REMOVE_USER:
      return Object.assign({}, state, {
        user: {
          ...state.user.user,
          isLoggedIn: true,
        }
      });

    case types.OPEN_USERINFO_MODAL:
      return Object.assign({}, state, {
        userModalInfo: {
          _id: action.userInfo._id,
          displayName: action.userInfo.displayName,
          avatar: action.userInfo.avatar,
          mode: action.mode
        },
        isModalOpened: action.shouldToggle ? !this.state.isModalOpened : true
      });

    case types.CLOSE_USERINFO_MODAL:
      return Object.assign({}, state, {
        userModalInfo: {
          _id: null,
          displayName: null,
          avatar: null
        },
        isModalOpened: false,
      });

    case types.BOOKMARK_SUCCESS:
      return Object.assign({}, state, {
        user: {
          isLoggedIn: true,
          strategy: action.payload.strategy,
          _id: action.payload._id,
          email: action.payload.email,
          displayName: action.payload.displayName,
          avatar: action.payload.avatar || null,
          bookmarked: action.payload.bookmarked
        }
      });

    case types.TAGS_SEARCH:
      return {
        ...state,
        tagsList: {
          status: 'INIT'
        }
      };

    case types.TAGS_SEARCH_SUCCESS:
      return {
        ...state,
        tagsList: {
          status: 'SUCCESS',
          data: action.payload
        }
      };

    case types.TAGS_SEARCH_FAILURE:
      return {
        ...state,
        tagsList: {
          status: 'FAILURE',
          error: action.payload.error
        }
      };

    default:
      return state;

  }

}
