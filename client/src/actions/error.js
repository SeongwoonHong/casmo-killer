import * as types from 'actions/types';

export const setErrorState = (error = null) => {
  return {
    type: types.SET_ERROR_STATE,
    payload: error
  };
};
