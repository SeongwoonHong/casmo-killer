/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import UserLoginContainer from './index';
import UserLogin from './UserLogin';

const mockStore = configureStore();

describe('<UserLogin />', () => {

  it('renders the component consistently', () => {

    const auth = { message: '' };
    const user = { isLoggedIn: false };

    const component = shallow(
      <UserLogin
        auth={ auth }
        user={ user }
        match={ { params: { type: 'login' } } } />
    );

    expect(component).toMatchSnapshot();
    expect(component.find('.user-page-title').text()).toEqual('Login to your accountlock');

    component.setProps({ match: { params: { type: 'register' } } });
    expect(component.find('.user-page-title').text()).toEqual('Sign up for freemode_edit');

  });

});

describe('<UserLoginContainer />', () => {
  it('fucks you', () => {
    expect(true).toEqual(true);
  });
});
