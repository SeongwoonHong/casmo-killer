/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import axios from 'axios';
import { validateEmail } from '@sharedUtils/inputValidators';

import LocalLogin from './LocalLogin';

describe('<LocalLogin />', () => {

  let component = null;
  let mockObj = null;

  beforeEach(() => {
    component = shallow(<LocalLogin />);
    mockObj = sinon.stub(axios, 'post');
  });

  afterEach(() => {
    mockObj.restore();
  });

  it('should render the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('should hide password field when it\'s register page', () => {

    const item = mount(
      <MemoryRouter>
        <LocalLogin isLogin={ false } />
      </MemoryRouter>
    );

    expect(item.find('UserInputField').last().find('input').length).toEqual(0);

  });

  it('should reset the component state when isLogin prop changes', () => {

    const spy = sinon.spy(LocalLogin.prototype, 'componentWillReceiveProps');
    const setState = sinon.spy(LocalLogin.prototype, 'setState');

    const { initialState } = component.instance();

    component.setProps({ isLogin: true });

    expect(spy.calledOnce).toEqual(true);
    expect(setState.calledWith(initialState)).toEqual(true);

  });

  it('should call onLogin method on login form submit', () => {

    const spy = sinon.spy(LocalLogin.prototype, 'onLogin');

    component.setProps({ isLogin: true });

    component.instance().onSubmitHandler();
    expect(spy.calledOnce).toEqual(true);

  });

  it('should call onRegister method on register form submit', () => {

    const spy = sinon.spy(LocalLogin.prototype, 'onRegister');

    component.setProps({ isLogin: false });

    component.instance().onSubmitHandler();
    expect(spy.calledOnce).toEqual(true);

  });

  it('should make sure that both fields are not empty', () => {

    component.setProps({ isLogin: true });
    component.setState({ email: '', password: '' });

    component.instance().onSubmitHandler();

    expect(component.state('message')).toEqual('Please enter your email and password.');

  });

  it('should make sure that a valid email is entered for registration', async (done) => {

    const invalidEmail = 'invalidemail';
    const message = await validateEmail(invalidEmail);

    component.setProps({ isLogin: false });
    component.setState({ email: invalidEmail });

    component.instance().onSubmitHandler();

    setImmediate(() => {
      expect(component.state('message')).toEqual(message);
      done();
    });

  });

  it('should resolve the response from the server to the state when loggingin', async () => {

    const spy = sinon.spy();

    const userData = { data: { user: { isLoggedIn: false } } };
    const promise = Promise.resolve(userData);

    mockObj.callsFake(() => promise);

    const components = shallow(
      <LocalLogin
        isLogin={ true }
        onSuccess={ spy } />
    );

    components.setState({ email: 'email@address.com', password: 'password' });

    components.instance().onLogin();

    await promise;

    expect(spy.calledWith(userData.data.user)).toEqual(true);

  });

});
