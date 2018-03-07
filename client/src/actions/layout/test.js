import * as actions from './index';
import * as types from './types';

describe('layout actions', () => {

  it('should dispatch toggleMenu action', () => {

    const payload = false;
    const expectedAction = {
      type: types.TOGGLE_MAIN_MENU,
      payload
    };

    expect(actions.toggleMenu(payload)).toEqual(expectedAction);

  });

  it('should dispatch toggleMenu action with no payload', () => {

    const expectedAction = {
      type: types.TOGGLE_MAIN_MENU,
      payload: null
    };

    expect(actions.toggleMenu()).toEqual(expectedAction);

  });

  it('should dispatch updateBreakpoint action', () => {

    const payload = 'xs';
    const expectedAction = {
      type: types.UPDATE_BREAK_POINT,
      payload
    };

    expect(actions.updateBreakpoint(payload)).toEqual(expectedAction);

  });

  it('should dispatch toggleUserMenu action', () => {

    const payload = true;
    const expectedAction = {
      type: types.TOGGLE_USER_MENU,
      payload
    };

    expect(actions.toggleUserMenu(payload)).toEqual(expectedAction);

  });

  it('should dispatch toggleUserMenu action with no payload', () => {

    const expectedAction = {
      type: types.TOGGLE_USER_MENU,
      payload: null
    };

    expect(actions.toggleUserMenu()).toEqual(expectedAction);

  });

  it('should dispatch toggleAppLoading action', () => {

    const payload = false;
    const expectedAction = {
      type: types.TOGGLE_APP_LOADING,
      payload
    };

    expect(actions.toggleAppLoading(payload)).toEqual(expectedAction);

  });

  it('should dispatch toggleAppLoading action with no payload', () => {

    const expectedAction = {
      type: types.TOGGLE_APP_LOADING,
      payload: null
    };

    expect(actions.toggleAppLoading()).toEqual(expectedAction);

  });

});
