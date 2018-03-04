import * as actions from './index';
import * as types from './types';

describe('auth actions', () => {

  it('should dispatch registerRedirectMessage action', () => {

    const payload = 'please log in to continue';
    const expectedAction = {
      type: types.REGISTER_REDIRECT_MESSAGE,
      payload
    };

    expect(actions.registerRedirectMessage(payload)).toEqual(expectedAction);

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
