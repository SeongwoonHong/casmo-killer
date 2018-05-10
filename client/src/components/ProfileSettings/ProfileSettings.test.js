/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import axios from 'axios';

import { validateEmail, validateDisplayName } from '@sharedUtils/inputValidators';
import ProfileSettings from './ProfileSettings';

describe('<ProfileSettings />', () => {

  const userData = {
    email: 'ckboard@gmail.com',
    displayName: 'ckboard',
    avatar: 'http://i1.kym-cdn.com/photos/images/newsfeed/000/250/007/672.jpg'
  };

  let component;
  let mockGet;
  let mockPost;
  let mockPut;

  beforeEach(() => {

    component = shallow(
      <ProfileSettings
        user={ userData } />
    );

    mockGet = sinon.stub(axios, 'get');
    mockPost = sinon.stub(axios, 'post');
    mockPut = sinon.stub(axios, 'put');

  });

  afterEach(() => {
    mockGet.restore();
    mockPost.restore();
    mockPut.restore();
  });

  it('should render the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('should update the component state with the user state', () => {

    const newUserData = {
      email: {
        value: 'ckboardtoronto@gmail.com',
        message: ''
      },
      displayName: {
        value: 'ckboardToronto',
        message: ''
      },
      avatar: userData.avatar
    };

    component.setState(newUserData);

    expect(component.state('email').value).toEqual(newUserData.email.value);
    expect(component.state('displayName').value).toEqual(newUserData.displayName.value);
    expect(component.find('.Profile-settings').props().disabled).toEqual(false);

  });

  it('should reject invalid user information and display the message', async () => {

    const testData = {
      email: 'ckboardgmail',
      displayName: 'ckb',
      avatar: 'http://i1.kym-cdn.com/photos/images/newsfeed/000/250/007/672.jpg'
    };

    const wrapper = shallow(
      <ProfileSettings
        user={ testData } />
    );

    wrapper.instance().onSubmitHandler();

    const emailMsg = await validateEmail(testData.email);
    const dnMsg = await validateDisplayName(testData.displayName);

    expect(wrapper.state('email').message).toEqual(emailMsg);
    expect(wrapper.state('displayName').message).toEqual(dnMsg);

  });

  it('should submit the form and emit onSuccess event', async (done) => {

    const spy = sinon.spy();

    const responseData = {
      data: {
        user: {
          isLoggedIn: true
        },
        message: 'server message',
        emailSuccessMsg: 'server success message',
      }
    };

    const promiseOne = Promise.resolve({ data: { isDuplicate: false } });
    const promiseTwo = Promise.resolve({ data: { isDuplicate: false } });
    const promiseThree = Promise.resolve(responseData);

    const testData = {
      email: 'thisshouldpassthetest@gmail.com',
      displayName: 'passthetest',
      avatar: 'http://i1.kym-cdn.com/photos/images/newsfeed/000/250/007/672.jpg'
    };

    mockGet.callsFake(() => promiseOne);
    mockPost.callsFake(() => promiseTwo);
    mockPut.callsFake(() => promiseThree);

    const wrapper = shallow(
      <ProfileSettings
        user={ testData }
        onSuccess={ spy } />
    );

    wrapper.instance().onSubmitHandler();

    await promiseOne;
    await promiseTwo;
    await promiseThree;

    setImmediate(() => {
      expect(spy.calledWith(responseData.data.user)).toEqual(true);
      done();
    });

  });

});
