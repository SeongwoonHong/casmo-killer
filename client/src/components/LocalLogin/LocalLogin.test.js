import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import LocalLogin from './LocalLogin';

describe('<LocalLogin />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(<LocalLogin />);
  });

  it('renders the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('registers input values to the component state', () => {

    const values = [
      { name: 'email', value: 'ssinsoo@gmail.com' },
      { name: 'password', value: '123456' }
    ];

    for (const value of values) {
      component.instance().onChangeHandler(value);
      expect(component.state()[value.name]).toEqual(value.value);
    }

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

    component.instance().onLogin();

    expect(component.state('message')).toEqual('Please enter your email and password.');

  });

});
