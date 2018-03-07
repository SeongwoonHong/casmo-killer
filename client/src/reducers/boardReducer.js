import update from 'react-addons-update';
import * as types from '../actions/types';

const initialState = {
  newBoard: {
    status: 'INIT',
    data: null,
    error: null
  },
  boardList: {
    status: 'INIT',
    data: [],
    error: null
  }
};

export default function board(state = initialState, action) {
  switch (action.type) {
    // FETCH BOARDS
    case types.FETCH_BOARDS:
      return update(state, {
        boardList: {
          status: { $set: 'WAITING' },
        }
      });
    // FETCH SUCCEESS
    case types.FETCH_BOARDS_SUCCESS:
      return update(state, {
        boardList: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload }
        }
      });
    // FETCH FAILURE
    case types.FETCH_BOARDS_FAILURE:
      return update(state, {
        boardList: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });

    // CREATE BOARD
    case types.CREATE_BOARD:
      return update(state, {
        newBoard: {
          status: { $set: 'WAITING' },
        }
      });
    case types.CREATE_BOARD_SUCCESS:
      return update(state, {
        newBoard: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.payload }
        }
      });
    case types.CREATE_BOARD_FAILURE:
      return update(state, {
        newBoard: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });
    case types.RESET_BOARD_LIST:
      return update(state, {
        boardList: {
          status: { $set: 'INIT' },
          data: { $set: [] },
          error: { $set: null }
        }
      });
    default:
      return state;
  }
}
