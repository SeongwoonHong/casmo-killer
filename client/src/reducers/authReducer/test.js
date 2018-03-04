/* eslint import/no-named-default: 0 */

import * as types from '@actions/types';
import { default as reducer, initialState } from './index';

describe('authReducer', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState.auth);
  });

  it('should register redirect message', () => {

    const message = 'redirect message';

    expect(
      reducer(undefined, {
        type: types.REGISTER_REDIRECT_MESSAGE,
        payload: message
      })
    ).toEqual(
      Object.assign({}, initialState.auth, {
        message
      })
    );

  });

  it('should reset redirect url and message to its initial state', () => {

    expect(
      reducer(undefined, {
        type: types.CLEAR_REDIRECT_URL
      })
    ).toEqual(
      Object.assign({}, initialState.auth, {
        redirectUrl: initialState.auth.redirectUrl,
        message: initialState.auth.message
      })
    );

  });

  it('should register user information to the auth state', () => {

    const authPayload = {
      strategy: 'local',
      email: 'email@address.com',
      displayName: '  display name  ',
      socialId: 'socialid123456',
      socialToken: 'socialtokenabcdefg123456789'
    };

    expect(
      reducer(undefined, {
        type: types.SET_USER_FOR_REGISTER,
        payload: authPayload
      })
    ).toEqual(
      Object.assign({}, initialState.auth, {
        strategy: authPayload.strategy,
        email: authPayload.email,
        displayName: 'displayname',
        socialId: authPayload.socialId,
        socialToken: authPayload.socialToken
      })
    );

  });

  it('should reset auth state', () => {

    expect(
      reducer(undefined, {
        type: types.RESET_AUTH_STATE
      })
    ).toEqual(initialState.auth);

  });

});
