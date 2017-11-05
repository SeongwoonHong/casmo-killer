import update from 'react-addons-update';
import _ from 'lodash';
import * as types from '../actions/types';

const initialState = {
  post: {
    status: 'INIT',
    error: -1
  },
  list: {
    status: 'INIT',
    data: {},
    isLast: false
  },
  edit: {
    status: 'INIT',
    error: -1,
  },
  remove: {
    status: 'INIT',
    error: -1
  },
  star: {
    status: 'INIT',
    error: -1
  },
  detail: {
    status: 'INIT',
    data: {},
    error: -1
  }
};

export default function post(state = initialState, action) {
  switch (action.type) {
    case types.POST_SUBMIT:
      return update(state, {
        post: {
          status: { $set: 'WAITING' }
        }
      });
    case types.POST_SUBMIT_SUCCESS:
      return update(state, {
        post: {
          status: { $set: 'SUCCESS' }
        }
      });
    case types.POST_SUBMIT_FAILURE:
      return update(state, {
        post: {
          status: { $set: 'FAILURE' },
          error: { $set: action.error }
        }
      });
    case types.POST_LIST:
      return update(state, {
        list: {
          status: { $set: 'WAITING' },
        }
      });
    case types.POST_LIST_SUCCESS:
      if (action.isInitial) {
        return update(state, {
          list: {
            status: { $set: 'SUCCESS' },
            data: { $set: _.mapKeys(action.data, '_id') },
            isLast: { $set: action.data.length < 6 }
          }
        });
      }
      if (action.listType === 'new') {
        return update(state, {
          list: {
            status: { $set: 'SUCCESS' },
            data: { $unshift: action.data },
          }
        });
      }
      return update(state, {
        list: {
          status: { $set: 'SUCCESS' },
          data: { $push: action.data },
          isLast: { $set: action.data.length < 6 }
        }
      });
    case types.POST_LIST_FAILURE:
      return update(state, {
        list: {
          status: { $set: 'FAILURE' }
        }
      });
    case types.POST_EDIT:
      return update(state, {
        edit: {
          status: { $set: 'WAITING' },
          error: { $set: -1 },
          memo: { $set: undefined }
        }
      });
    case types.POST_EDIT_SUCCESS:
      return update(state, {
        edit: {
          status: { $set: 'SUCCESS' }
        },
        list: {
          data: {
            [action.index]: { $set: action.memo }
          }
        }
      });
    case types.POST_EDIT_FAILURE:
      return update(state, {
        edit: {
          status: { $set: 'FAILURE' },
          error: { $set: action.error }
        }
      });
    case types.POST_REMOVE:
      return update(state, {
        remove: {
          status: { $set: 'WAITING' },
          error: { $set: -1 }
        }
      });
    case types.POST_REMOVE_SUCCESS:
      return update(state, {
        remove: {
          status: { $set: 'SUCCESS' }
        },
        list: {
          data: { $splice: [[action.index, 1]] }
        }
      });
    case types.POST_REMOVE_FAILURE:
      return update(state, {
        remove: {
          status: { $set: 'FAILURE' },
          error: { $set: action.error }
        }
      });
    case types.POST_STAR:
      return update(state, {
        star: {
          status: { $set: 'WAITING' },
          error: { $set: -1 }
        }
      });
    case types.POST_STAR_SUCCESS:
      return update(state, {
        star: {
          status: { $set: 'SUCCESS' }
        },
        list: {
          data: { [action.index]: { $set: action.memo } }
        }
      });
    case types.POST_STAR_FAILURE:
      return update(state, {
        star: {
          status: { $set: 'FAILURE' },
          error: { $set: action.error }
        }
      });
    case types.POST_DETAIL:
      return update(state, {
        detail: {
          status: { $set: 'WAITING' },
          error: { $set: -1 }
        }
      });
    case types.POST_DETAIL_SUCCESS:
      return update(state, {
        detail: {
          status: { $set: 'SUCCESS' },
          data: { $set: action.data }
        }
      });
    case types.POST_DETAIL_FAILURE:
      return update(state, {
        detail: {
          status: { $set: 'FAILURE' },
          error: { $set: action.error }
        }
      });
    default:
      return state;
  }
}
