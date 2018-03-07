import axios from 'axios';
import * as types from './types';

// FETCH ACTIVITY
export function fetchActivity() {
  return {
    type: types.FETCH_ACTIVITY
  };
}

export function fetchActivitySuccess(activity, isInitial, listType) {
  return {
    type: types.FETCH_ACTIVITY_SUCCESS,
    payload: {
      activity,
      isInitial,
      listType
    }
  };
}

export function fetchActivityFailure(error) {
  return {
    type: types.FETCH_ACTIVITY_FAILURE,
    payload: error
  };
}

/*
    Parameter:
        - isInitial: whether it is for initial loading
        - listType:  OPTIONAL; loading 'old' memo or 'new' memo
        - id:        OPTIONAL; activity id (one at the bottom or one at the top)
        - userId:  OPTIONAL; find activity of following user
*/
export function fetchActivityRequest(isInitial, listType, id, userId) {
  return (dispatch) => {
    // Inform Login API is starting
    dispatch(fetchActivity());
    // API request
    let url = '/api/activity';
    url = isInitial ? `${url}/${userId}` : `${url}/${userId}/${listType}/${id}`;
    return axios.get(url)
      .then((response) => {
        dispatch(fetchActivitySuccess(response.data, isInitial, listType));
      }).catch((error) => {
        console.log(error);
        dispatch(fetchActivityFailure(error));
      });
  };

}
