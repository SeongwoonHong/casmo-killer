import axios from 'axios';
import {
  // Post list
  FETCH_POSTS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,

  // Create new post
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  RESET_NEW_POST,
  RESET_POST_FIELDS,

  // Fetch post
  FETCH_POST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
  RESET_ACTIVE_POST,

  // Delete post
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  RESET_DELETED_POST
} from './types';

// FETCH POSTS
export function fetchPosts() {
  const request = axios({
    method: 'get',
    url: '/api/post',
    headers: []
  });

  return {
    type: FETCH_POSTS,
    payload: request
  };
}

export function fetchPostsSuccess(posts) {
  return {
    type: FETCH_POSTS_SUCCESS,
    payload: posts
  };
}

export function fetchPostsFailure(error) {
  return {
    type: FETCH_POSTS_FAILURE,
    payload: error
  };
}

export function resetPostFields() {
  return {
    type: RESET_POST_FIELDS
  };
}

export function createPost(props, tokenFromStorage) {
  const request = axios({
    method: 'post',
    data: props,
    url: '/api/post',
    headers: {
      Authorization: `ck-board-App12341 ${tokenFromStorage}`
    }
  });

  return {
    type: CREATE_POST,
    payload: request
  };
}

export function createPostSuccess(newPost) {
  return {
    type: CREATE_POST_SUCCESS,
    payload: newPost
  };
}

export function createPostFailure(error) {
  return {
    type: CREATE_POST_FAILURE,
    payload: error
  };
}

export function resetNewPost() {
  return {
    type: RESET_NEW_POST
  };
}

export function resetDeletedPost() {
  return {
    type: RESET_DELETED_POST
  };
}


export function fetchPost(id) {
  const request = axios.get(`/api/post/${id}`);

  return {
    type: FETCH_POST,
    payload: request
  };
}


export function fetchPostSuccess(activePost) {
  return {
    type: FETCH_POST_SUCCESS,
    payload: activePost
  };
}

export function fetchPostFailure(error) {
  return {
    type: FETCH_POST_FAILURE,
    payload: error
  };
}

export function resetActivePost() {
  return {
    type: RESET_ACTIVE_POST
  };
}


export function deletePost(id) {
  const request = axios({
    method: 'delete',
    url: `/api/post/${id}`,
    // headers: {
    //   Authorization: `ck-board-App12341 ${tokenFromStorage}`
    // }
  });
  return {
    type: DELETE_POST,
    payload: request
  };
}

export function deletePostSuccess(deletedPost) {
  return {
    type: DELETE_POST_SUCCESS,
    payload: deletedPost
  };
}

export function deletePostFailure(response) {
  return {
    type: DELETE_POST_FAILURE,
    payload: response
  };
}


/* EDIT POST */
export function EditPost() {
  return {
    type: POST_EDIT
  };
}

export function EditPostSuccess(index, post) {
  return {
    type: POST_EDIT_SUCCESS,
    index,
    post
  };
}

export function EditPostFailure(error) {
  return {
    type: POST_EDIT_FAILURE,
    error
  };
}
export function editPostRequest(id, index, contents) {
  return (dispatch) => {
    // Inform Edit Post API is starting
    dispatch(editPost());
    // API request
    return axios.put(`/api/post/${id}`, { contents })
      .then((response) => {
        dispatch(editPostSuccess(index, response.data.memo));
      }).catch((error) => {
        dispatch(editPostFailure(error.response.data.code));
      });
  };
}

/* POST TOGGLE STAR */
export function postStar() {
  return {
    type: POST_STAR
  };
}

export function postStarSuccess(index, memo) {
  return {
    type: POST_STAR_SUCCESS,
    index,
    memo
  };
}

export function postStarFailure(error) {
  return {
    type: POST_STAR_FAILURE,
    error
  };
}
export function postStarRequest(id, index) {
  return (dispatch) => {
    // TO BE IMPLEMENTED
    return axios.post(`/api/post/star/${id}`)
      .then((response) => {
        dispatch(postStarSuccess(index, response.data.memo));
      }).catch((error) => {
        dispatch(postStarFailure(error.response.data.code));
      });
  };
}
