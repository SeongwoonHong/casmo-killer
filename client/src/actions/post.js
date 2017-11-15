import axios from 'axios';
import * as types from './types';

// FETCH POSTS
export function fetchPosts(boardId, page) {
  const request = axios({
    method: 'get',
    url: `/api/post/${boardId}/${page}`,
    headers: []
  });

  return {
    type: types.FETCH_POSTS,
    payload: request
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
    payload: error
  };
}

// FETCH BOARDS
export function fetchBoards() {
  const request = axios({
    method: 'get',
    url: '/api/post/board',
    headers: []
  });

  return {
    type: types.FETCH_BOARDS,
    payload: request
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

export function resetPostFields() {
  return {
    type: types.RESET_POST_FIELDS
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
    type: types.CREATE_POST,
    payload: request
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

export function resetNewPost() {
  return {
    type: types.RESET_NEW_POST
  };
}

export function resetDeletedPost() {
  return {
    type: types.RESET_DELETED_POST
  };
}


export function fetchPost(id) {
  const request = axios.get(`/api/post/detail/${id}`);

  return {
    type: types.FETCH_POST,
    payload: request
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

export function resetActivePost() {
  return {
    type: types.RESET_ACTIVE_POST
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
    type: types.DELETE_POST,
    payload: request
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
    type: types.EDIT_POST,
    payload: request
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

export function resetEditPost() {
  return {
    type: types.RESET_EDIT_POST
  };
}

// FETCH POSTS
export function searchPosts(searchWord, boardId, page) {
  const request = axios({
    method: 'get',
    url: `/api/post/search/${searchWord}/${boardId}/${page}`,
    headers: []
  });

  return {
    type: types.SEARCH_POSTS,
    payload: request
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
    type: types.CREATE_REPLY,
    payload: request
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

export function resetNewReply() {
  return {
    type: types.RESET_NEW_REPLY
  };
}
