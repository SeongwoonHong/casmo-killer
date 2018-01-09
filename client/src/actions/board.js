import axios from 'axios';
import * as types from './types';

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
export function fetchBoardsRequest(user, type) {
  return (dispatch) => {
    // Inform Login API is starting
    dispatch(fetchBoards());
    let apiURL;

    if (type === 'bookmark') {
      apiURL = `/api/board/bookmark/${user}`;
    } else if (type === 'my') {
      apiURL = `/api/board/my/${user}`;
    } else {
      apiURL = '/api/board/all';
    }

    // API request
    return axios.get(apiURL)
      .then((response) => {
        dispatch(fetchBoardsSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(fetchBoardsFailure(error));
      });
  };
}

// CREATE BOARD
export function createBoard() {
  return {
    type: types.CREATE_BOARD
  };
}
export function createBoardSuccess(newBoard) {
  return {
    type: types.CREATE_BOARD_SUCCESS,
    payload: newBoard
  };
}

export function createBoardFailure(error) {
  return {
    type: types.CREATE_BOARD_FAILURE,
    payload: error
  };
}

export function createBoardRequest(contents) {
  return (dispatch) => {
    dispatch(createBoard());
    // tokenFromStorage
    return axios.post('/api/board', contents)
      .then((response) => {
        dispatch(createBoardSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(createBoardFailure(error));
      });
  };
}

// BOOKMARK REQUEST
export function bookmark() {
  return {
    type: types.BOOKMARK
  };
}
export function bookmarkSuccess() {
  return {
    type: types.BOOKMARK_SUCCESS
  };
}

export function bookmarkFailure(error) {
  return {
    type: types.BOOKMARK_FAILURE,
    payload: error
  };
}

export function bookmarkRequest(boardId, user) {
  const contents = {
    boardId,
    user
  };
  return (dispatch) => {
    dispatch(bookmark());
    // tokenFromStorage
    return axios.post('/api/board/bookmark', contents)
      .then((response) => {
        dispatch(bookmarkSuccess(response.data));
      }).catch((error) => {
        console.log(error);
        dispatch(bookmarkFailure(error));
      });
  };
}

/* RESET BOARD LIST */
export function resetBoardList() {
  return {
    type: types.RESET_BOARD_LIST
  };
}
