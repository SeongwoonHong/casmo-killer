/* eslint-disable max-len */
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
  boardAuthor: {
    author: null
  },
  boardInfo: {
    board: null
  },
  activePost: {
    status: 'INIT',
    data: null,
    error: null
  },
  newComment: {
    status: 'INIT',
    error: null
  },
  userList: {
    status: 'INIT',
    data: [],
    error: null
  },
  likes: {
    status: 'INIT',
    error: null
  },
  disLikes: {
    status: 'INIT',
    error: null
  },
  deleteComment: {
    status: 'INIT',
    error: null
  },
  updateComment: {
    status: 'INIT',
    error: null
  },
  replyComment: {
    status: 'INIT',
    parentAuthor: null,
    parentContent: null,
    error: null
  },
  hotPostList: {
    status: 'INIT',
    data: [],
    error: null,
  },
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
        },
        boardAuthor: {
          author: { $set: action.payload.meta.author }
        },
        boardInfo: {
          board: { $set: action.payload.board }
        }
      });
    case types.FETCH_POSTS_FAILURE:
      return update(state, {
        list: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });

      // FETCH HOT POSTS
    case types.FETCH_HOT_POSTS:
      return update(state, {
        hotPostList: {
          status: { $set: 'WAITING' },
        },
      });
    case types.FETCH_HOT_POSTS_SUCCESS:
      return update(state, {
        hotPostList: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload }
        },
      });
    case types.FETCH_HOT_POSTS_FAILURE:
      return update(state, {
        hotPostList: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        },
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

      // SEARCH USER POSTS
    case types.SEARCH_USER_POSTS:
      return update(state, {
        userList: {
          status: { $set: 'WAITING' },
        }
      });
    case types.SEARCH_USER_POSTS_SUCCESS:
      return update(state, {
        userList: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload.posts }
        }
      });
    case types.SEARCH_USER_POSTS_FAILURE:
      return update(state, {
        userList: {
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
          error: { $set: action.payload.message }
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

    // LIKES
    case types.GIVE_LIKES:
      return {
        ...state,
        likes: {
          status: 'WAITING',
          error: null
        }
      };
    case types.GIVE_LIKES_SUCCESS:
      return {
        ...state,
        activePost: {
          ...state.list,
          status: 'SUCCESS',
          data: action.payload.post
        },
        likes: {
          status: 'SUCCESS',
          error: null
        }
      };
    case types.GIVE_LIKES_FAILURE:
      return {
        ...state,
        likes: {
          status: 'FAILURE',
          error: action.payload
        }
      };
    // DISLIKES
    case types.GIVE_DISLIKES:
      return {
        ...state,
        disLikes: {
          status: 'WAITING',
          error: null
        }
      };
    case types.GIVE_DISLIKES_SUCCESS:
      return {
        ...state,
        activePost: {
          ...state.list,
          status: 'SUCCESS',
          data: action.payload.post
        },
        disLikes: {
          status: 'SUCCESS',
          error: null
        }
      };
    case types.GIVE_DISLIKES_FAILURE:
      return {
        ...state,
        disLikes: {
          status: 'FAILURE',
          error: action.payload
        }
      };
    // DELETE COMMENTS
    case types.DELETE_COMMENT:
      return {
        ...state,
        deleteComment: {
          status: 'WAITING',
          error: null
        }
      };
    case types.DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        activePost: {
          ...state.activePost,
          data: {
            ...state.activePost.data,
            comments: state.activePost.data.comments.slice(0, action.index).concat(state.activePost.data.comments.slice(action.index + 1, state.activePost.data.comments.length))
          }
        },
        deleteComment: {
          status: 'SUCCESS',
          error: null
        }
      };
    case types.DELETE_COMMENT_FAILURE:
      return {
        ...state,
        deleteComment: {
          status: 'FAILURE',
          error: action.payload
        }
      };
    case types.UPDATE_COMMENT:
      return {
        ...state,
        updateComment: {
          status: 'WAITING',
          error: null
        }
      };
    case types.UPDATE_COMMENT_SUCCESS:
      return {
        ...state,
        activePost: {
          ...state.activePost,
          data: {
            ...state.activePost.data,
            comments: action.payload
          }
        },
        updateComment: {
          status: 'SUCCESS',
          error: null
        }
      };
    case types.UPDATE_COMMENT_FAILURE:
      return {
        ...state,
        updateComment: {
          status: 'FAILURE',
          error: action.payload
        }
      };
    case types.REPLY_COMMENT_WAITING:
      return {
        ...state,
        replyComment: {
          status: 'WAITING',
          parentAuthor: action.payload.data.commentAuthor,
          parentCommentId: action.payload.data.commentId,
          parentContent: action.payload.data.comment
        }
      };
    case types.REPLY_COMMENT_RESET:
      return {
        ...state,
        replyComment: {
          status: 'INIT'
        }
      };

    default:
      return state;
  }
}
