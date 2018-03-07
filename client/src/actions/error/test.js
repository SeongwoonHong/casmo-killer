import * as actions from './index';
import * as types from './types';

describe('auth actions', () => {

  it('should dispatch setErrorState action', () => {

    const payload = 'error object';
    const expectedAction = {
      type: types.SET_ERROR_STATE,
      payload
    };

    expect(actions.setErrorState(payload)).toEqual(expectedAction);

  });

});
