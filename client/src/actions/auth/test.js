import * as actions from './index';
import * as types from './types';

describe('auth actions', () => {

  it('should dispatch registerRedirectUrl action', () => {

    const payload = '/test/url';
    const expectedAction = {
      type: types.REGISTER_REDIRECT_URL,
      payload
    };

    expect(actions.registerRedirectUrl(payload)).toEqual(expectedAction);

  });

  it('should dispatch clearRedirectUrl action', () => {

    const expectedAction = {
      type: types.CLEAR_REDIRECT_URL
    };

    expect(actions.clearRedirectUrl()).toEqual(expectedAction);

  });

  it('should dispatch setUserForRegistration action', () => {

    const payload = 'userInfo';
    const expectedAction = {
      type: types.SET_USER_FOR_REGISTER,
      payload
    };

    expect(actions.setUserForRegistration(payload)).toEqual(expectedAction);

  });

  it('should dispatch resetAuthState action', () => {

    const expectedAction = {
      type: types.RESET_AUTH_STATE
    };

    expect(actions.resetAuthState()).toEqual(expectedAction);

  });

});
