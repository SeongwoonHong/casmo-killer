import axios from 'axios';
import * as types from './types';

// FETCH BOARDS START
export function fetchBoards() {
  return {
    type: types.FETCH_BOARDS
  };
}

// FETCH BOARDS SUCEESS ACTION
export function fetchBoardsSuccess(posts) {
  return {
    type: types.FETCH_BOARDS_SUCCESS,
    payload: posts
  };
}

// FETCH BOARDS FAILURE ACTION
export function fetchBoardsFailure(error) {
  return {
    type: types.FETCH_BOARDS_FAILURE,
    payload: error
  };
}

export const fetchBoardsRequest = (user, type, searchWord) => {

  return async (dispatch) => {
    // // FETCH START
    dispatch(fetchBoards());

    // Depend on type api URL is changed
    // bookmarked board & my board need user info to fetch
    let apiURL = '/api/board';

    if (type === 'bookmark') {
      apiURL = `/api/board/bookmark/${user}`;
    } else if (type === 'my') {
      apiURL = `/api/board/my/${user}`;
    } else {
      apiURL = '/api/board/all';
    }

    if (searchWord !== '' && searchWord !== undefined) {
      apiURL += `/search/${searchWord}`;
    }

    try {
      // API request
      const response = await axios.get(apiURL);
      dispatch(fetchBoardsSuccess(response.data));
    } catch (err) {
      dispatch(fetchBoardsFailure(err));
    }
  };
};

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
  return async (dispatch) => {
    dispatch(createBoard());
    // tokenFromStorage
    try {
      const response = await axios.post('/api/board', contents);
      return dispatch(createBoardSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(createBoardFailure(error));
    }
  };
}

// BOOKMARK REQUEST
export function bookmark() {
  return {
    type: types.BOOKMARK
  };
}

export function bookmarkSuccess(bookmarkResult) {
  return {
    type: types.BOOKMARK_SUCCESS,
    payload: bookmarkResult
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
