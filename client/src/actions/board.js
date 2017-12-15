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
export function fetchBoardsRequest() {
  return (dispatch) => {
    // Inform Login API is starting
    dispatch(fetchBoards());
    // API request
    return axios.get('/api/board')
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
