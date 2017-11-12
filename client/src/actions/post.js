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
  RESET_DELETED_POST,

  // Edit post
  EDIT_POST,
  EDIT_POST_SUCCESS,
  EDIT_POST_FAILURE,
  RESET_EDIT_POST,

  // Search posts
  SEARCH_POSTS,
  SEARCH_POSTS_SUCCESS,
  SEARCH_POSTS_FAILURE,

  // Create reply
  CREATE_REPLY,
  CREATE_REPLY_SUCCESS,
  CREATE_REPLY_FAILURE
} from './types';

// FETCH POSTS
export function fetchPosts(page) {
  const request = axios({
    method: 'get',
    url: `/api/post/${page}`,
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
  const request = axios.get(`/api/post/detail/${id}`);

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


export function editPost(id, props, tokenFromStorage) {
  const request = axios({
    method: 'put',
    data: props,
    url: `/api/post/${id}`,
    headers: {
      Authorization: `ck-board-App12341 ${tokenFromStorage}`
    }
  });

  return {
    type: EDIT_POST,
    payload: request
  };
}

export function editPostSuccess(editData) {
  return {
    type: EDIT_POST_SUCCESS,
    payload: editData
  };
}

export function editPostFailure(error) {
  return {
    type: EDIT_POST_FAILURE,
    payload: error
  };
}

export function resetEditPost() {
  return {
    type: RESET_EDIT_POST
  };
}

// FETCH POSTS
export function searchPosts(searchWord, page) {
  const request = axios({
    method: 'get',
    url: `/api/post/search/${searchWord}/${page}`,
    headers: []
  });

  return {
    type: SEARCH_POSTS,
    payload: request
  };
}

export function searchPostsSuccess(posts) {
  return {
    type: SEARCH_POSTS_SUCCESS,
    payload: posts
  };
}

export function searchPostsFailure(error) {
  return {
    type: SEARCH_POSTS_FAILURE,
    payload: error
  };
}

export function createReply(comment, postId) {
  const data = {
    comment,
    postId
  };
  const request = axios({
    method: 'post',
    data,
    url: '/api/post/reply',
    // headers: {
    //   Authorization: `ck-board-App12341 ${tokenFromStorage}`
    // }
  });

  return {
    type: CREATE_REPLY,
    payload: request
  };
}

export function createReplySuccess(newPost) {
  return {
    type: CREATE_REPLY_SUCCESS,
    payload: newPost
  };
}

export function createReplyFailure(error) {
  return {
    type: CREATE_REPLY_FAILURE,
    payload: error
  };
}

export function resetNewReply() {
  return {
    type: RESET_NEW_REPLY
  };
}
