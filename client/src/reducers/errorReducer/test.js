/* eslint import/no-named-default: 0 */

import * as types from '@actions/types';
import { default as reducer, initialState } from './index';

describe('errorReducer', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState.error);
  });

  it('should set error state', () => {

    const errorPayload = {
      errorTitle: 'errorTitle',
      errorMsg: 'errorMsg',
      redirectUrl: '/redirect/url'
    };

    expect(
      reducer(undefined, {
        type: types.SET_ERROR_STATE,
        payload: errorPayload
      })
    ).toEqual(Object.assign({}, initialState.error, errorPayload));

  });

});
