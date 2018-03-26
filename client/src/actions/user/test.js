import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './index';
import * as types from '../types';

const mockStore = configureMockStore([thunk]);

describe('user actions', () => {

  it('should dispatch loginSuccess resetAuthState action only', () => {

    const payload = 'shit';
    const expectedActions = [
      {
        type: types.LOGIN_SUCCESS,
        payload
      }
    ];

    const store = mockStore({});

    store
      .dispatch(actions.loginSuccess('shit'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });

  });

  it('should dispatch loginSuccess as well as resetAuthState action', () => {

    const payload = 'shit';
    const expectedActions = [
      {
        type: types.LOGIN_SUCCESS,
        payload
      },
      {
        type: types.RESET_AUTH_STATE
      }
    ];

    const store = mockStore({});

    store.dispatch(actions.loginSuccess('shit', true))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });

  });

  it('should dispatch removeUser action', () => {

    const expectedAction = {
      type: types.REMOVE_USER
    };

    expect(actions.removeUser()).toEqual(expectedAction);

  });

});
