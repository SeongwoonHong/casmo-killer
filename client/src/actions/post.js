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
    payload: error
  };
}

export function fetchPostsRequest(boardId, page, sort) {
  return (dispatch) => {
    // Inform Login API is starting
    dispatch(fetchPosts());
    // API request
    return axios.get(`/api/post/${boardId}/${page}/${sort}`)
      .then((response) => {
        dispatch(fetchPostsSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(fetchPostsFailure(error));
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

export function searchUserPosts() {
  return {
    type: types.SEARCH_USER_POSTS
  };
}
export function searchUserPostsSuccess(posts) {
  return {
    type: types.SEARCH_USER_POSTS_SUCCESS,
    payload: posts
  };
}

export function searchUserPostsFailure(error) {
  return {
    type: types.SEARCH_USER_POSTS_FAILURE,
    error
  };
}

export function searchPostsRequest(searchWord, boardId, page) {
  return (dispatch) => {
    if (boardId === null) {
      dispatch(searchUserPosts());
    } else {
      dispatch(searchPosts());
    }
    // API request
    let url;
    if (boardId === null) {
      url = `/api/post/search/userModalInfo/${searchWord}`;
    } else {
      url = `/api/post/search/${searchWord}/${boardId}/${page}`;
    }
    return axios.get(url)
      .then((response) => {
        if (boardId === null) {
          dispatch(searchUserPostsSuccess(response.data));
        } else {
          dispatch(searchPostsSuccess(response.data));
        }
      }).catch((error) => {
        console.log(error);
        if (boardId === null) {
          dispatch(searchUserPostsFailure(error));
        } else {
          dispatch(searchPostsFailure(error));
        }
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

// EDIT Post
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
  console.log(data);
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
    type: types.RESET_NEW_BOARD
  };
}

export function giveLikes() {
  return {
    type: types.GIVE_LIKES
  };
}
export function giveLikesSuccess(post) {
  return {
    type: types.GIVE_LIKES_SUCCESS,
    payload: {
      post
    }
  };
}
export function giveLikesFailure(error) {
  return {
    type: types.GIVE_LIKES_FAILURE,
    payload: error
  };
}

export function giveLikesRequest(id, type, commentId) {
  return (dispatch) => {

    dispatch(giveLikes());
    if (type === 'post') {
      return axios.post(`/api/post/likes/${id}`).then((response) => {
        dispatch(giveLikesSuccess(response.data));
      }).catch((e) => {
        console.error(e);
        dispatch(giveLikesFailure(e));
      });
    } else {
      return axios.post(`/api/post/comment/likes/${id}/${commentId}`).then((response) => {
        dispatch(giveLikesSuccess(response.data));
      }).catch((e) => {
        console.error(e);
        dispatch(giveLikesFailure(e));
      });
    }
  };
}

export function giveDislikes() {
  return {
    type: types.GIVE_DISLIKES
  };
}
export function giveDislikesSuccess(post) {
  return {
    type: types.GIVE_DISLIKES_SUCCESS,
    payload: {
      post
    }
  };
}
export function giveDislikesFailure(error) {
  return {
    type: types.GIVE_DISLIKES_FAILURE,
    payload: error
  };
}

export function giveDislikesRequest(id, type, commentId) {
  return (dispatch) => {

    dispatch(giveDislikes());
    if (type === 'post') {
      axios.post(`/api/post/disLikes/${id}`).then((response) => {
        dispatch(giveDislikesSuccess(response.data));
      }).catch((e) => {
        console.error(e);
        dispatch(giveDislikesFailure(e));
      });
    } else {
      axios.post(`/api/post/comment/disLikes/${id}/${commentId}`).then((response) => {
        dispatch(giveDislikesSuccess(response.data));
      }).catch((e) => {
        console.error(e);
        dispatch(giveDislikesFailure(e));
      });
    }

  };
}

export function deleteComment() {
  return {
    type: types.DELETE_COMMENT
  };
}

export function deleteCommentFailure(error) {
  return {
    type: types.DELETE_COMMENT_FAILURE,
    payload: error
  };
}

export function deleteCommentSuccess(index) {
  return {
    type: types.DELETE_COMMENT_SUCCESS,
    index
  };
}

export function deleteCommentRequest(postId, commentId, index) {
  return (dispatch) => {
    dispatch(deleteComment());
    return axios.post(`/api/post/comment/${postId}/${commentId}`)
      .then(() => {
        dispatch(deleteCommentSuccess(index));
      }).catch((error) => {
        console.log(error);
        dispatch(deleteCommentFailure(error));
      });
  };
}
export function updateComment() {
  return {
    type: types.UPDATE_COMMENT
  };
}
export function updateCommentSuccess(data) {
  return {
    type: types.UPDATE_COMMENT_SUCCESS,
    payload: data
  };
}

export function updateCommentFailure(error) {
  return {
    type: types.UPDATE_COMMENT_FAILURE,
    payload: error
  };
}

export function updateCommentRequest(postId, commentId, contents) {
  return (dispatch) => {
    dispatch(updateComment());
    return axios.post(`/api/post/comment/update/${postId}/${commentId}`, { contents }).then((res) => {
      dispatch(updateCommentSuccess(res.data));
    }).catch((e) => {
      throw e;
      dispatch(updateCommentFailure(e));
    });
  };
}
