/* eslint import/no-named-default: 0 */

import * as types from '@actions/types';
import { default as reducer, initialState } from './index';

describe('userReducer', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should update user state when logged in', () => {

    const userPayload = {
      strategy: 'local',
      _id: 'isthisidornot',
      email: 'email@address.com',
      displayName: 'displayname',
      bookmarked: []
    };

    expect(
      reducer(undefined, {
        type: types.LOGIN_SUCCESS,
        payload: userPayload
      })
    ).toEqual(
      Object.assign({}, initialState, {
        user: {
          isLoggedIn: true,
          strategy: userPayload.strategy,
          _id: userPayload._id,
          email: userPayload.email,
          displayName: userPayload.displayName,
          avatar: null,
          bookmarked: userPayload.bookmarked
        }
      })
    );

  });

  it('should update user state when logged out', () => {

    expect(
      reducer(undefined, {
        type: types.LOGOUT
      })
    ).toEqual(
      Object.assign({}, initialState, {
        user: initialState.user
      })
    );

  });

  it('should remove user info except for the login status', () => {

    expect(
      reducer(undefined, {
        type: types.REMOVE_USER
      })
    ).toEqual(
      Object.assign({}, initialState, {
        user: {
          ...initialState.user.user,
          isLoggedIn: true,
        }
      })
    );

  });

});
