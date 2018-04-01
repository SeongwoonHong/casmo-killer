/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';

import UserRecover from './UserRecover';

describe('<UserRecover />', () => {

  let component;
  let mockPost;

  beforeEach(() => {
    component = shallow(
      <UserRecover />
    );
    mockPost = sinon.stub(axios, 'post');
  });

  afterEach(() => {
    mockPost.restore();
  });

  it('should render the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('should construct the component with the correct state', () => {
    expect(component.state()).toEqual({
      isLoading: false,
      isSuccess: false,
      email: '',
      message: ''
    });
  });

  it('should make sure that value is entered for email', () => {

    component.setState({ email: '' });

    component.instance().onSubmitHandler();

    expect(component.state('isSuccess')).toEqual(false);
    expect(component.state('message')).toEqual('Please enter your email address');

  });

  it('should send the data to the server and resolve the response to the state', async () => {

    const responseData = { data: { message: 'server message' } };
    const responsePromise = Promise.resolve(responseData);

    mockPost.callsFake(() => responsePromise);

    component.setState({ email: 'ckboard@gmail.com' });

    component.instance().onSubmitHandler();

    await responsePromise;

    expect(component.state('isSuccess')).toEqual(true);
    expect(component.state('message')).toEqual(responseData.data.message);

  });

});
