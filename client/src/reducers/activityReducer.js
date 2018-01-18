import update from 'react-addons-update';
import * as types from '../actions/types';

const initialState = {
  list: {
    status: 'INIT',
    data: [],
    error: null,
    isLast: false
  }
};

export default function (state = initialState, action) {

  switch (action.type) {

    case types.FETCH_ACTIVITY:
      return update(state, {
        list: {
          status: { $set: 'WAITING' },
        }
      });
    case types.FETCH_ACTIVITY_SUCCESS:
      if (action.payload.isInitial) {
        return update(state, {
          list: {
            status: { $set: 'SUCCESS' },
            data: { $set: action.payload.activity },
            isLast: { $set: action.payload.activity.length < 6 }
          }
        });
      }
      return update(state, {
        list: {
          status: { $set: 'SUCCESS' },
          data: { $push: action.payload.activity },
          isLast: { $set: action.payload.activity.length < 6 }
        }
      });
    case types.FETCH_ACTIVITY_FAILURE:
      return update(state, {
        list: {
          status: { $set: 'FAILURE' },
          error: { $set: action.payload.response.data }
        }
      });

    default:
      return state;

  }

}
