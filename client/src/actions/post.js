import axios from 'axios';
import * as types from './types';

// FETCH POSTS
export function fetchPosts() {
  return {
    type: types.FETCH_POSTS
  };
}

export function fetchPostsSuccess(posts) {
  return {
    type: types.FETCH_POSTS_SUCCESS,
    payload: posts
  };
}

export function fetchPostsFailure(error) {
  return {
    type: types.FETCH_POSTS_FAILURE,
    error
  };
}

export function fetchPostsRequest(boardId, page) {
  return (dispatch) => {
    // Inform Login API is starting
    dispatch(fetchPosts());
    // API request
    return axios.get(`/api/post/${boardId}/${page}`)
      .then((response) => {
        dispatch(fetchPostsSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(fetchPostsFailure(error));
      });
  };
}

// FETCH BOARDS
export function fetchBoards() {
  return {
    type: types.FETCH_BOARDS
  };
}
export function fetchBoardsSuccess(posts) {
  return {
    type: types.FETCH_BOARDS_SUCCESS,
    payload: posts
  };
}

export function fetchBoardsFailure(error) {
  return {
    type: types.FETCH_BOARDS_FAILURE,
    payload: error
  };
}
export function fetchBoardsRequest() {
  return (dispatch) => {
    // Inform Login API is starting
    dispatch(fetchBoards());
    // API request
    return axios.get('/api/post/board')
      .then((response) => {
        dispatch(fetchBoardsSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(fetchBoardsFailure(error));
      });
  };
}

// SEARCH POSTS
export function searchPosts() {
  return {
    type: types.SEARCH_POSTS
  };
}
export function searchPostsSuccess(posts) {
  return {
    type: types.SEARCH_POSTS_SUCCESS,
    payload: posts
  };
}

export function searchPostsFailure(error) {
  return {
    type: types.SEARCH_POSTS_FAILURE,
    error
  };
}
export function searchPostsRequest(searchWord, boardId, page) {
  return (dispatch) => {
    dispatch(searchPosts());
    // API request
    return axios.get(`/api/post/search/${searchWord}/${boardId}/${page}`)
      .then((response) => {
        dispatch(searchPostsSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(searchPostsFailure(error));
      });
  };
}

// FETCH DETAIL
export function fetchPost() {
  return {
    type: types.FETCH_POST
  };
}


export function fetchPostSuccess(activePost) {
  return {
    type: types.FETCH_POST_SUCCESS,
    payload: activePost
  };
}

export function fetchPostFailure(error) {
  return {
    type: types.FETCH_POST_FAILURE,
    payload: error
  };
}

export function fetchPostRequest(id) {
  return (dispatch) => {
    dispatch(fetchPost());

    return axios.get(`/api/post/detail/${id}`)
      .then((response) => {
        dispatch(fetchPostSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(fetchPostFailure(error));
      });
  };
}

// CREATE POST
export function createPost() {
  return {
    type: types.CREATE_POST
  };
}
export function createPostSuccess(newPost) {
  return {
    type: types.CREATE_POST_SUCCESS,
    payload: newPost
  };
}

export function createPostFailure(error) {
  return {
    type: types.CREATE_POST_FAILURE,
    payload: error
  };
}

export function createPostRequest(contents, boardId) {
  return (dispatch) => {
    dispatch(createPost());
    // tokenFromStorage
    return axios.post(`/api/post/${boardId}`, contents)
      .then((response) => {
        dispatch(createPostSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(createPostFailure(error));
      });
  };
}

export function editPost() {
  return {
    type: types.EDIT_POST
  };
}
export function editPostSuccess(editData) {
  return {
    type: types.EDIT_POST_SUCCESS,
    payload: editData
  };
}

export function editPostFailure(error) {
  return {
    type: types.EDIT_POST_FAILURE,
    payload: error
  };
}

export function editPostRequest(id, contents) {
  return (dispatch) => {
    dispatch(editPost());
    // tokenFromStorage
    return axios.put(`/api/post/${id}`, contents)
      .then((response) => {
        dispatch(editPostSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(editPostFailure(error));
      });
  };
}

export function deletePost() {
  return {
    type: types.DELETE_POST
  };
}

export function deletePostSuccess(deletedPost) {
  return {
    type: types.DELETE_POST_SUCCESS,
    payload: deletedPost
  };
}

export function deletePostFailure(response) {
  return {
    type: types.DELETE_POST_FAILURE,
    payload: response
  };
}

export function deletePostRequest(id) {
  return (dispatch) => {
    dispatch(deletePost());
    // tokenFromStorage
    return axios.delete(`/api/post/${id}`)
      .then((response) => {
        dispatch(deletePostSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(deletePostFailure(error));
      });
  };
}

export function resetPostProps() {
  return {
    type: types.RESET_POST_PROPS
  };
}

export function createReply() {
  return {
    type: types.CREATE_REPLY
  };
}

export function createReplySuccess(newPost) {
  return {
    type: types.CREATE_REPLY_SUCCESS,
    payload: newPost
  };
}

export function createReplyFailure(error) {
  return {
    type: types.CREATE_REPLY_FAILURE,
    payload: error
  };
}

export function createReplyRequest(comment, postId) {
  const data = {
    comment,
    postId
  };

  return (dispatch) => {
    dispatch(createReply());
    // tokenFromStorage
    return axios.post('/api/post/reply', data)
      .then((response) => {
        dispatch(createReplySuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(createReplyFailure(error));
      });
  };
}

export function resetNewReply() {
  return {
    type: types.RESET_NEW_REPLY
  };
}
