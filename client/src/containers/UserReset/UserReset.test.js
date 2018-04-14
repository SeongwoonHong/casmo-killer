/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';
import { validatePassword } from '@sharedUtils/inputValidators';

import UserReset from './UserReset';


describe('<UserReset />', () => {

  let component;
  let mockGet;
  let mockPut;

  beforeEach(() => {

    component = shallow(
      <UserReset
        setErrorState={ () => {} }
        history={ { push: () => {} } }
        match={ { params: { token: null } } } />
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

  it('should verify the token for registration', async () => {

    const replace = sinon.spy();

    const userData = { data: { email: 'ckboard@gmail.com' } };
    const promise = Promise.resolve(userData);

    mockGet.callsFake(() => promise);

    shallow(
      <UserReset
        history={ { replace } }
        match={ { params: { token: 'abcdefghijk' } } } />
    );

    await promise;

    expect(replace.calledWith('/user/reset')).toEqual(true);

  });

  it('should redirect to error page when the token is not present', () => {

    const setErrorState = sinon.spy();
    const push = sinon.spy();

    shallow(
      <UserReset
        setErrorState={ setErrorState }
        history={ { push } }
        match={ { params: { } } } />
    );

    expect(setErrorState.calledWith({
      errorTitle: 'The registration link is invalid.',
      errorMsg: 'Please submit your email again to reset the password.'
    })).toEqual(true);
    expect(push.calledWith('/error')).toEqual(true);

  });

  it('should check when confirm password is different from new password', async () => {

    const testData = {
      newPassword: 'abcd1234',
      confirmPassword: '1234abcd'
    };

    component.setState(testData);

    component.instance().onSubmitHandler();

    const messageToTest = await validatePassword(testData.newPassword, testData.confirmPassword, true);

    expect(component.state('isSuccess')).toEqual(false);
    expect(component.state('message')).toEqual(messageToTest);

  });

  it('should submit the form to the server and resolve the response to the state', async () => {

    const testData = {
      newPassword: 'abcd1234',
      confirmPassword: 'abcd1234'
    };

    const serverData = { data: { message: 'server response' } };
    const promise = Promise.resolve(serverData);

    mockPut.callsFake(() => promise);

    component.setState(testData);

    component.instance().onSubmitHandler();

    await Promise.resolve();
    await promise;

    expect(component.state('isSuccess')).toEqual(true);
    expect(component.state('message')).toEqual(serverData.data.message);

  });

});
