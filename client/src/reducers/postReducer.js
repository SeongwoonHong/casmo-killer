import * as types from '../actions/types';

const initialState = {
  postsList: {
    posts: [], error: null, loading: false, page: 1
  },
  boardsList: {
    boards: [], error: null, loading: false
  },
  pagination: {
    pageCount: 1
  },
  newPost: {
    post: null, error: null, loading: false
  },
  newComment: {
    comment: null, error: null, loading: false
  },
  activePost: {
    post: null, error: null, loading: false
  },
  deletedPost: {
    post: null, error: null, loading: false
  },
  editPost: {
    post: null, error: null, loading: false
  }
};

export default function post(state = initialState, action) {
  let error;
  switch (action.type) {
    case types.FETCH_POSTS:// start fetching posts and set loading = true
      return { ...state, postsList: { posts: [], error: null, loading: true } };
    case types.FETCH_POSTS_SUCCESS:// return list of posts and make loading = false
      return {
        ...state,
        postsList: {
          posts: action.payload.posts,
          error: null,
          loading: false,
          page: action.payload.meta.pagination
        },
        pagination: {
          pageCount: action.payload.meta.pagination
        }
      };
    case types.FETCH_POSTS_FAILURE:// return error and make loading = false
      error = action.payload || { message: action.payload.message };
      // 2nd one is network or server down errors
      return { ...state, postsList: { posts: [], error, loading: false } };
    case types.SEARCH_POSTS:// start searcing posts and set loading = true
      return { ...state, postsList: { posts: [], error: null, loading: true } };
    case types.SEARCH_POSTS_SUCCESS:// return list of posts and make loading = false
      return {
        ...state,
        postsList: {
          posts: action.payload.posts,
          error: null,
          loading: false
        },
        pagination: {
          pageCount: action.payload.meta.pagination
        }
      };
    case types.SEARCH_POSTS_FAILURE:// return error and make loading = false
      error = action.payload || { message: action.payload.message };
      // 2nd one is network or server down errors
      return { ...state, postsList: { posts: [], error, loading: false } };

    case types.CREATE_POST:
      return { ...state, newPost: { ...state.newPost, loading: true } };
    case types.CREATE_POST_SUCCESS:
      return { ...state, newPost: { post: action.payload, error: null, loading: false } };
    case types.CREATE_POST_FAILURE:
      error = action.payload || { message: action.payload.message };
      // 2nd one is network or server down errors
      return { ...state, newPost: { post: null, error, loading: false } };
    case types.RESET_NEW_POST:
      return { ...state, newPost: { post: null, error: null, loading: false } };

    case types.RESET_POST_FIELDS:
      return { ...state, newPost: { ...state.newPost, error: null, loading: null } };
    case types.FETCH_POST:
      return { ...state, activePost: { ...state.activePost, loading: true } };
    case types.FETCH_POST_SUCCESS:
      return { ...state, activePost: { post: action.payload, error: null, loading: false } };
    case types.FETCH_POST_FAILURE:
      error = action.payload || { message: action.payload.message };
      // 2nd one is network or server down errors
      return { ...state, activePost: { post: null, error, loading: false } };
    case types.RESET_ACTIVE_POST:
      return { ...state, activePost: { post: null, error: null, loading: false } };
    case types.DELETE_POST:
      return { ...state, deletedPost: { ...state.deletedPost, loading: true } };
    case types.DELETE_POST_SUCCESS:
      return { ...state, deletedPost: { post: action.payload, error: null, loading: false } };
    case types.DELETE_POST_FAILURE:
      error = action.payload || { message: action.payload.message };
      // 2nd one is network or server down errors
      return { ...state, deletedPost: { post: null, error, loading: false } };
    case types.RESET_DELETED_POST:
      return { ...state, deletedPost: { post: null, error: null, loading: false } };

    case types.EDIT_POST:
      return {
        ...state,
        editPost: { ...state.editPost, loading: true },
        activePost: { ...state.editPost, loading: true }
      };
    case types.EDIT_POST_SUCCESS:
      return {
        ...state,
        editPost: { post: action.payload, error: null, loading: false },
        activePost: { post: action.payload, error: null, loading: false }
      };
    case types.EDIT_POST_FAILURE:
      error = action.payload || { message: action.payload.message };
      // 2nd one is network or server down errors
      return {
        ...state,
        editPost: { post: null, error, loading: false },
        activePost: { post: null, error, loading: false }
      };
    case types.RESET_EDIT_POST:
      return { ...state, editPost: { post: null, error: null, loading: false } };
    case types.CREATE_REPLY:
      return { ...state, newComment: { ...state.newComment, loading: true } };
    case types.CREATE_REPLY_SUCCESS:
      return {
        ...state,
        newComment: { comment: action.payload, error: null, loading: false },
        activePost: { post: action.payload.data, error: null, lading: false }
      };
    case types.CREATE_REPLY_FAILURE:
      error = action.payload || { message: action.payload.message };
      // 2nd one is network or server down errors
      return { ...state, newComment: { comment: null, error, loading: false } };
    case types.RESET_NEW_REPLY:
      return { ...state, newComment: { comment: null, error: null, loading: false } };
    case types.FETCH_BOARDS:// start fetching boards and set loading = true
      return { ...state, boardsList: { boards: [], error: null, loading: true } };
    case types.FETCH_BOARDS_SUCCESS:// return list of boards and make loading = false
      return {
        ...state,
        boardsList: {
          boards: action.payload,
          error: null,
          loading: false
        }
      };
    case types.FETCH_BOARDS_FAILURE:// return error and make loading = false
      error = action.payload || { message: action.payload.message };
      // 2nd one is network or server down errors
      return { ...state, boardsList: { boards: [], error, loading: false } };
    default:
      return state;
  }
}
