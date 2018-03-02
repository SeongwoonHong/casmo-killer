/* eslint import/no-named-default: 0 */

import * as types from '@actions/types';
import { default as reducer, initialState } from './index';

describe('layoutReducer', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState.layout);
  });

  it('should update breakPoint state', () => {

    const payload = 'xl';

    expect(
      reducer(undefined, {
        type: types.UPDATE_BREAK_POINT,
        payload
      })
    ).toEqual(
      Object.assign({}, initialState.layout, {
        breakPoint: payload
      })
    );

  });

  it('should update main menu open state', () => {

    expect(
      reducer(undefined, {
        type: types.TOGGLE_MAIN_MENU,
        payload: true
      })
    ).toEqual(
      Object.assign({}, initialState.layout, {
        isMainMenuVisible: true
      })
    );

  });

  it('should toggle main menu open state', () => {

    expect(
      reducer(undefined, {
        type: types.TOGGLE_MAIN_MENU,
        payload: null
      })
    ).toEqual(
      Object.assign({}, initialState.layout, {
        isMainMenuVisible: !initialState.layout.isMainMenuVisible
      })
    );

  });

  it('should update user menu state', () => {

    expect(
      reducer(undefined, {
        type: types.TOGGLE_USER_MENU,
        payload: false
      })
    ).toEqual(
      Object.assign({}, initialState.layout, {
        isUserMenuVisible: false
      })
    );

  });

  it('should toggle user menu state', () => {

    expect(
      reducer(undefined, {
        type: types.TOGGLE_USER_MENU,
        payload: null
      })
    ).toEqual(
      Object.assign({}, initialState.layout, {
        isUserMenuVisible: !initialState.layout.isUserMenuVisible
      })
    );

  });

  it('should update app loading state', () => {

    expect(
      reducer(undefined, {
        type: types.TOGGLE_APP_LOADING,
        payload: true
      })
    ).toEqual(
      Object.assign({}, initialState.layout, {
        isAppLoading: true
      })
    );

  });

  it('should toggle app loading state', () => {

    expect(
      reducer(undefined, {
        type: types.TOGGLE_APP_LOADING,
        payload: null
      })
    ).toEqual(
      Object.assign({}, initialState.layout, {
        isAppLoading: !initialState.layout.isAppLoading
      })
    );

  });

});
