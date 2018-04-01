/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import UserLogin from './UserLogin';
import ConnectedUserLogin from './index';

const mockStore = configureStore();

describe('<UserLogin />', () => {

  let component;

  beforeEach(() => {

    const auth = { message: '' };
    const user = { isLoggedIn: false };

    component = shallow(
      <UserLogin
        auth={ auth }
        user={ user }
        match={ { params: { type: 'login' } } } />
    );

  });

  it('should render the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('should display correct text and icons', () => {
    expect(component.find('.user-page-title').text()).toEqual('Login to your accountlock');
    component.setProps({ match: { params: { type: 'register' } } });
    expect(component.find('.user-page-title').text()).toEqual('Sign up for freemode_edit');
  });

  it('should trigger componentWillReceiveProps when login status changes', () => {

    const auth = { message: '' };
    const user = { isLoggedIn: false };

    const spy = sinon.spy(UserLogin.prototype, 'componentWillReceiveProps');
    const replace = sinon.spy();

    const wrapper = shallow(
      <UserLogin
        auth={ auth }
        user={ user }
        history={ { replace } }
        match={ { params: { type: 'login' } } } />
    );

    wrapper.setProps({ user: { isLoggedIn: true } });

    expect(spy.calledOnce).toEqual(true);
    expect(replace.calledWith('/')).toEqual(true);

  });

  it('should trigger loginSuccess action when login is successful', async () => {

    const loginSuccess = sinon.spy();

    const userData = { user: { isLoggedIn: false } };
    const promise = Promise.resolve(userData);

    const wrapper = shallow(
      <UserLogin
        auth={ { message: '' } }
        user={ userData }
        loginSuccess={ loginSuccess }
        match={ { params: { type: 'login' } } } />
    );

    wrapper.instance().onLoginSuccess(userData);

    await promise;

    expect(loginSuccess.calledWith(userData, true)).toEqual(true);

  });

  it('should trigger setUserForRegistration action when it is social register', () => {

    const setUserForRegistration = sinon.spy();

    const userData = { user: { strategy: 'facebook' } };

    const wrapper = shallow(
      <UserLogin
        auth={ { message: '' } }
        user={ userData }
        setUserForRegistration={ setUserForRegistration }
        match={ { params: { type: 'login' } } } />
    );

    wrapper.instance().onSocialRegister(userData);
    expect(setUserForRegistration.calledWith(userData)).toEqual(true);

  });

});

describe('<ConnectedUserLogin />', () => {

  const initialState = {
    auth: {
      message: ''
    },
    user: {
      user: {
        isLoggedIn: false
      }
    }
  };
  const store = mockStore(initialState);

  let component;

  beforeEach(() => {

    component = shallow(
      <ConnectedUserLogin store={ store } />
    );

  });

  it('should render the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('should receive correct props from the store', () => {
    expect(component.prop('auth')).toEqual(initialState.auth);
    expect(component.prop('user')).toEqual(initialState.user.user);
  });

});
