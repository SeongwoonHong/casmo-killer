/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';

import UserRegister from './UserRegister';

describe('<UserRegister />', () => {

  let component;
  let mockGet;
  let mockPost;

  const auth = {
    strategy: 'facebook',
    email: 'ssinsoo@gmail.com',
    password: null,
    displayName: 'LyndonOhhyungChun',
    avatar: 'https://lookaside.facebook.com/platform/profilepic/?asid=1527248567354389&height=50&width=50&ext=1522858773&hash=AeTOk-4ueDQXWd1T',
    socialId: '1527248567354389',
    socialToken: 'EAAB86Ub9xDcBAFJCETkRP2KeSR2ZBEVSf02hXXpTLuDhSRGNTXMjroXJwu6UNDidVFFpElN7DUoC5ifhVJiSAWNQ3kwAxr5rNKBFZC9SvCZBg4mcKc0QZBzYGrNru5vwUEHo2ly71zAcyXLy1TIDuc0hdhTTWXfACLyPSuP1IW6gr1MT8hI5bEIwS91SDLdCipHbBe7DSAZDZD',
    redirectUrl: '/',
    verificationToken: null,
    message: ''
  };

  beforeEach(() => {

    component = shallow(
      <UserRegister
        auth={ auth }
        match={ { params: { token: auth.token } } } />
    );

    mockGet = sinon.stub(axios, 'get');
    mockPost = sinon.stub(axios, 'post');

  });

  afterEach(() => {
    mockGet.restore();
    mockPost.restore();
  });

  it('should render the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('should construct the component state with correct props', () => {
    expect(component.state()).toEqual({
      isMounted: true,
      isLoading: false,
      displayName: {
        value: auth.displayName,
        message: ''
      },
      password: {
        value: '',
        message: ''
      },
      avatar: {
        value: auth.avatar,
        message: ''
      },
      errorMsg: ''
    });
  });

  it('should submit the form and empty remove messages', async (done) => {

    const loginSuccess = sinon.spy();
    const replace = sinon.spy();

    const userData = { data: { isDuplicate: false } };
    const registrationData = { data: { user: { isLoggedIn: true } } };

    const promise = Promise.resolve(userData);
    const registrationPromise = Promise.resolve(registrationData);

    mockGet.callsFake(() => promise);
    mockPost.callsFake(() => registrationPromise);

    const wrapper = shallow(
      <UserRegister
        auth={ auth }
        user={ registrationData.data.user }
        loginSuccess={ loginSuccess }
        history={ { replace } }
        match={ { params: { token: auth.socialToken } } } />
    );

    wrapper.instance().onSubmitHandler();

    await promise;
    await registrationPromise;

    expect(component.state('displayName').message).toEqual('');
    expect(component.state('password').message).toEqual('');
    expect(component.state('avatar').message).toEqual('');

    // TODO: figure out a way to reorder the test
    setImmediate(() => {
      expect(loginSuccess.calledWith(registrationData.data.user, true)).toEqual(true);
      expect(replace.calledWith('/')).toEqual(true);
      done();
    });

  });

  it('should verify the token for registration', async () => {

    const setUserForRegistration = sinon.spy();
    const replace = sinon.spy();

    const userData = { data: { email: 'ckboard@gmail.com' } };
    const promise = Promise.resolve(userData);

    mockGet.callsFake(() => promise);

    shallow(
      <UserRegister
        auth={ auth }
        setUserForRegistration={ setUserForRegistration }
        history={ { replace } }
        match={ { params: { token: auth.socialToken } } } />
    );

    await promise;

    expect(setUserForRegistration.calledWith({
      strategy: 'local',
      email: userData.data.email
    })).toEqual(true);
    expect(replace.calledWith('/user/register')).toEqual(true);

  });

  it('should redirect to error page when there is no token and email', () => {

    const setErrorState = sinon.spy();
    const push = sinon.spy();

    shallow(
      <UserRegister
        auth={ {} }
        setErrorState={ setErrorState }
        history={ { push } }
        match={ { params: { token: null } } } />
    );

    expect(setErrorState.calledWith({
      errorTitle: 'The registration link is invalid.',
      errorMsg: 'Please submit your email again to complete the registration.'
    })).toEqual(true);
    expect(push.calledWith('/error')).toEqual(true);

  });

});
