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

  beforeEach(() => {
    component = shallow(<LocalLogin />);
  });

  it('renders the component consistently', () => {
    expect(true).toEqual(true);
    // expect(component).toMatchSnapshot();
  });

  it('should hide password field when it\'s register page', () => {

    const item = mount(
      <MemoryRouter>
        <LocalLogin isLogin={ false } />
      </MemoryRouter>
    );

    expect(item.find('UserInputField').last().find('input').length).toEqual(0);

  });

  it('should call onSubmitHandler when values are entered in the input fields', () => {

    const email = { name: 'email', value: 'email@address.com' };
    const password = { name: 'password', value: '123456' };

    const onChangeHandler = sinon.spy(LocalLogin.prototype, 'onChangeHandler');

    const item = mount(
      <MemoryRouter>
        <LocalLogin
          isLogin={ true }
          redirectUrl="/" />
      </MemoryRouter>
    ).find(LocalLogin);

    const UserInputField = item.find('UserInputField');

    UserInputField.first().find('input').simulate('change', { target: email });
    UserInputField.last().find('input').simulate('change', { target: password });

    expect(onChangeHandler.calledWith(email)).toEqual(true);
    expect(onChangeHandler.calledWith(password)).toEqual(true);

    expect(item.instance().state.email).toEqual(email.value);
    expect(item.instance().state.password).toEqual(password.value);

  });

  it('reset the component state when isLogin prop changes', () => {

    const spy = sinon.spy(LocalLogin.prototype, 'componentWillReceiveProps');
    const setState = sinon.spy(LocalLogin.prototype, 'setState');

    const { initialState } = component.instance();

    component.setProps({ isLogin: true });

    expect(spy.calledOnce).toEqual(true);
    expect(setState.calledWith(initialState)).toEqual(true);

  });

  it('call onLogin method on login form submit', () => {

    const spy = sinon.spy(LocalLogin.prototype, 'onLogin');

    component.setProps({ isLogin: true });

    component.instance().onSubmitHandler();
    expect(spy.calledOnce).toEqual(true);

  });

  it('call onRegister method on register form submit', () => {

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

<<<<<<< HEAD
  it('should reflect the response from the server to the state', () => {
    // TODO: figure out a way to test async methods  (onLogin & onRegister)
=======
  it('should resolve the response from the server to the state', async () => {

    const spy = sinon.spy();

    const userData = { data: { user: { isLoggedIn: true } } };
    const promise = Promise.resolve(userData);

    sinon.stub(axios, 'post').callsFake(() => promise);

    const components = shallow(
      <LocalLogin
        isLogin={ true }
        onSuccess={ spy } />
    );

    components.setState({ email: 'email@address.com', password: 'password' });

    components.instance().onLogin();

    await promise;

    expect(spy.calledWith(userData.data.user)).toEqual(true);

>>>>>>> 581ec1ff399c6620d6d80ff7b0886a82fafce46d
  });

});
