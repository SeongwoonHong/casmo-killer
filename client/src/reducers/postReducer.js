import update from 'react-addons-update';
import * as types from '../actions/types';

const initialState = {
  newPost: {
    status: 'INIT',
    data: null,
    error: null
  },
  list: {
    status: 'INIT',
    data: [],
    error: null
  },
  editPost: {
    status: 'INIT',
    error: null
  },
  deletePost: {
    status: 'INIT',
    error: null
  },
  pagination: {
    pageCount: 1
  },
  activePost: {
    status: 'INIT',
    data: null,
    error: null
  },
  boardList: {
    status: 'INIT',
    data: [],
    error: null
  },
  newComment: {
    status: 'INIT',
    error: null
  }
};

export default function post(state = initialState, action) {
  switch (action.type) {


    // FETCH POST
    case types.FETCH_POSTS:
      return update(state, {
        list: {
          status: { $set: 'WAITING' },
        }
      });
    case types.FETCH_POSTS_SUCCESS:
      return update(state, {
        list: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload.posts }
        },
        pagination: {
          pageCount: { $set: action.payload.meta.pagination }
        }
      });
    case types.FETCH_POSTS_FAILURE:
      return update(state, {
        list: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });


      // SEARCH POSTS
    case types.SEARCH_POSTS:
      return update(state, {
        list: {
          status: { $set: 'WAITING' },
        }
      });
    case types.SEARCH_POSTS_SUCCESS:
      return update(state, {
        list: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload.posts }
        },
        pagination: {
          pageCount: { $set: action.payload.meta.pagination }
        }
      });
    case types.SEARCH_POSTS_FAILURE:
      return update(state, {
        list: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });


      // CREATE POST
    case types.CREATE_POST:
      return update(state, {
        newPost: {
          status: { $set: 'WAITING' },
        }
      });
    case types.CREATE_POST_SUCCESS:
      return update(state, {
        newPost: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload }
        }
      });
    case types.CREATE_POST_FAILURE:
      return update(state, {
        newPost: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });


      // FETCH POST
    case types.FETCH_POST:
      return update(state, {
        activePost: {
          status: { $set: 'WAITING' },
        }
      });
    case types.FETCH_POST_SUCCESS:
      return update(state, {
        activePost: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload }
        }
      });
    case types.FETCH_POST_FAILURE:
      return update(state, {
        activePost: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });


      // DELETE POST
    case types.DELETE_POST:
      return update(state, {
        deletePost: {
          status: { $set: 'WAITING' },
        }
      });
    case types.DELETE_POST_SUCCESS:
      return update(state, {
        deletePost: {
          status: { $set: 'SUCCESS' },
        }
      });
    case types.DELETE_POST_FAILURE:
      return update(state, {
        deletePost: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });


      // EDIT POST
    case types.EDIT_POST:
      return update(state, {
        editPost: {
          status: { $set: 'WAITING' },
        },
        activePost: {
          status: { $set: 'WAITING' },
        }
      });
    case types.EDIT_POST_SUCCESS:
      return update(state, {
        editPost: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload }
        },
        activePost: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload }
        }
      });
    case types.EDIT_POST_FAILURE:
      return update(state, {
        editPost: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        },
        activePost: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });


      // CREATE REPLY
    case types.CREATE_REPLY:
      return update(state, {
        newComment: {
          status: { $set: 'WAITING' },
        }
      });
    case types.CREATE_REPLY_SUCCESS:
      return update(state, {
        newComment: {
          status: { $set: 'SUCCESS' },
        },
        activePost: {
          data: { $set: action.payload }
        }
      });
    case types.CREATE_REPLY_FAILURE:
      return update(state, {
        newComment: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });


      // FETCH BOARDS
    case types.FETCH_BOARDS:
      return update(state, {
        boardList: {
          status: { $set: 'WAITING' },
        }
      });
    case types.FETCH_BOARDS_SUCCESS:
      return update(state, {
        boardList: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload }
        }
      });
    case types.FETCH_BOARDS_FAILURE:
      return update(state, {
        boardList: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });


      // RESET
    case types.RESET_NEW_REPLY:
      return update(state, {
        newComment: {
          status: { $set: 'WAITING' },
          error: { $set: null }
        }
      });
    case types.RESET_POST_PROPS:
      return update(state, {
        newPost: {
          status: { $set: 'INIT' },
          data: { $set: null },
          error: { $set: null }
        },
        activePost: {
          status: { $set: 'INIT' },
          data: { $set: null },
          error: { $set: null }
        },
        editPost: {
          status: { $set: 'INIT' },
          error: { $set: null }
        },
        deletePost: {
          status: { $set: 'INIT' },
          error: { $set: null }
        }
      });
    default:
      return state;
  }
}
