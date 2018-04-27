/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';

import UserSettings from './UserSettings';

describe('<UserSettings />', () => {

  const userData = {
    strategy: 'local'
  };

  let component;
  let mockGet;
  let mockPut;

  beforeEach(() => {

    component = shallow(
      <UserSettings
        user={ userData }
        match={ { params: {} } } />
    );

    mockGet = sinon.stub(axios, 'get');
    mockPut = sinon.stub(axios, 'put');

  });

  afterEach(() => {
    mockGet.restore();
    mockPut.restore();
  });

  it('should render the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('should verify the token', () => {

    const paramData = { token: 'abcdeft' };

    const spy = sinon.spy(UserSettings.prototype, 'verifyToken');
    const replace = sinon.spy();

    shallow(
      <UserSettings
        user={ userData }
        history={ { replace } }
        match={ { params: paramData } } />
    );

    expect(spy.calledWith(paramData.token)).toEqual(true);
    expect(replace.calledWith('/user/settings')).toEqual(true);

  });

  it('should verify the token by making a request to the server', async () => {

    const setStateSpy = sinon.spy(UserSettings.prototype, 'setState');
    const spy = sinon.spy();

    const responseData = {
      data: {
        user: {
          isLoggedIn: true
        },
        message: 'server message'
      }
    };
    const promise = Promise.resolve(responseData);

    mockPut.callsFake(() => promise);

    shallow(
      <UserSettings
        user={ { isLoggedIn: true } }
        history={ { replace: () => {} } }
        loginSuccess={ spy }
        match={ { params: { token: 'abcdeft' } } } />
    );

    await promise;

    expect(setStateSpy.calledWith({
      isSuccess: true,
      message: responseData.data.message
    })).toEqual(true);

    // simulating async storage method
    await Promise.resolve({ isLoggedIn: true });

    expect(spy.calledWith({ isLoggedIn: true })).toEqual(true);

  });

});
