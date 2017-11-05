import axios from 'axios';
import {
  POST_SUBMIT,
  POST_SUBMIT_SUCCESS,
  POST_SUBMIT_FAILURE,
  POST_LIST,
  POST_LIST_SUCCESS,
  POST_LIST_FAILURE,
  POST_EDIT,
  POST_EDIT_SUCCESS,
  POST_EDIT_FAILURE,
  POST_REMOVE,
  POST_REMOVE_SUCCESS,
  POST_REMOVE_FAILURE,
  POST_STAR,
  POST_STAR_SUCCESS,
  POST_STAR_FAILURE,
  POST_DETAIL,
  POST_DETAIL_SUCCESS,
  POST_DETAIL_FAILURE
} from './types';

/* POST SUBMIT */
export function postSubmit() {
  return {
    type: POST_SUBMIT
  };
}

export function postSubmitSuccess() {
  return {
    type: POST_SUBMIT_SUCCESS
  };
}

export function postSubmitFailure(error) {
  return {
    type: POST_SUBMIT_FAILURE,
    error
  };
}

export function postSubmitRequest(data) {
  return (dispatch) => {
    // SUBMIT API is starting
    dispatch(postSubmit());
    // API request
    return axios.post('/api/post', data)
      .then(() => {
        dispatch(postSubmitSuccess());
      }).catch((error) => {
        dispatch(postSubmitFailure(error));
      });
  };
}

/*
    Parameter:
        - isInitial: whether it is for initial loading
        - listType:  OPTIONAL; loading 'old' memo or 'new' memo
        - id:        OPTIONAL; memo id (one at the bottom or one at the top)
        - username:  OPTIONAL; find memos of following user
*/
export function postList() {
  return {
    type: POST_LIST
  };
}

export function postListSuccess(data, isInitial, listType) {
  return {
    type: POST_LIST_SUCCESS,
    data,
    isInitial,
    listType
  };
}

export function postListFailure() {
  return {
    type: POST_LIST_FAILURE
  };
}

export function postListRequest(isInitial, listType, id, username) {
  return (dispatch) => {
    // inform post list API is starting
    dispatch(postList());

    let url = '/api/post';

    if (typeof username === 'undefined') {
      // username not given, load public post
      url = isInitial ? url : `${url}/${listType}/${id}`;
      // or url + '/' + listType + '/' +  id
    } else {
      // load posts of specific user
      url = isInitial ? `${url}/${username}` : `${url}/${username}/${listType}/${id}`;
    }
    return axios.get(url)
      .then((response) => {
        dispatch(postListSuccess(response.data, isInitial, listType));
      }).catch((error) => {
        dispatch(postListFailure(error));
      });
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

/* MEMO DELETE POST */
export function deletePost() {
  return {
    type: POST_REMOVE
  };
}

export function deletePostSuccess(index) {
  return {
    type: POST_REMOVE_SUCCESS,
    index,
  };
}

export function deletePostFailure(error) {
  return {
    type: POST_REMOVE_FAILURE,
    error
  };
}
export function deletePostRequest(id, index) {
  return (dispatch) => {
    // Inform Delete Post API is starting
    dispatch(deletePost());
    // API request
    return axios.delete(`/api/post/${id}`)
      .then(() => {
        dispatch(deletePostSuccess(index));
      }).catch((error) => {
        dispatch(deletePostFailure(error.response.data.code));
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

// POST DETAIL
export function postDetail() {
  return {
    type: POST_DETAIL
  };
}

export function postDetailSuccess(data) {
  return {
    type: POST_DETAIL_SUCCESS,
    data
  };
}

export function postDetailFailure() {
  return {
    type: POST_DETAIL_FAILURE
  };
}

export function postDetailRequest(id) {
  return (dispatch) => {
    // inform post detail API is starting
    dispatch(postDetail());
    return axios.get(`/api/post/${id}`)
      .then((response) => {
        dispatch(postDetailSuccess(response.data));
      }).catch((error) => {
        dispatch(postDetailFailure(error));
      });
  };
}
