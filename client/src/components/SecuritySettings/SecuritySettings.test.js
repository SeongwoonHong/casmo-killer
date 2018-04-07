/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import axios from 'axios';

import { validatePassword } from '@sharedUtils/inputValidators';

import SecuritySettings from './SecuritySettings';

describe('<SecuritySettings />', () => {

  let wrapper;
  let component;

  let mockPost;
  let mockPut;

  let setStateSpy;

  beforeEach(() => {

    wrapper = mount(
      <MemoryRouter>
        <SecuritySettings
          strategy="local" />
      </MemoryRouter>
    );

    component = wrapper.find(SecuritySettings).instance();

    mockPost = sinon.stub(axios, 'post');
    mockPut = sinon.stub(axios, 'put');

    setStateSpy = sinon.spy(SecuritySettings.prototype, 'setState');

  });

  afterEach(() => {
    mockPost.restore();
    mockPut.restore();
    setStateSpy.restore();
  });

  it('should render the component consistently', () => {
    expect(shallow(<SecuritySettings />)).toMatchSnapshot();
  });

  it('should set the editing state to true when the button is clicked', () => {

    const initialBtn = wrapper.find('.user-form-button').first();

    initialBtn.simulate('click');

    expect(initialBtn.text()).toEqual('Cancel');
    expect(setStateSpy.calledWith({ isEditing: true })).toEqual(true);
    expect(component.state.isEditing).toEqual(true);

  });

  it('should reset the component to its initial state when the cancel button is clicked', () => {

    const { initialState } = component;

    wrapper
      .find(SecuritySettings)
      .instance()
      .setState({
        isEditing: true,
        isVerified: true
      });

    wrapper.find('.user-form-button').first().simulate('click');

    expect(setStateSpy.calledWith(initialState)).toEqual(true);

  });

  it('should verify the current password first before submitting', () => {

    // TODO: not sure why it has to be bound to the instance, not the prototype, need to investigate more
    // const spy = sinon.spy(SecuritySettings.prototype, 'verifyCurrentPassword');
    const spy = sinon.spy(component, 'verifyCurrentPassword');

    component.onSubmitHandler();

    expect(setStateSpy.calledWith({
      isLoading: true,
      message: ''
    })).toEqual(true);

    expect(spy.calledOnce).toEqual(true);

  });

  it('should not request the verification if the currentPassword field is empty', async () => {

    component.verifyCurrentPassword();
    expect(component.state.message).toEqual('Please enter your password.');

  });

  it('should send the entered password to the server and resolve the response from the server', async () => {

    const responseData = { status: 204 };
    const promise = Promise.resolve(responseData);

    mockPost.callsFake(() => promise);

    component.setState({ currentPassword: 'testpassword' });
    component.verifyCurrentPassword();

    await promise;

    expect(component.state.isVerified).toEqual(true);
    expect(component.state.isLoading).toEqual(false);

  });

  it('should display correct message when the request to the server fails', async () => {

    const responseData = { status: 205 };
    const promise = Promise.resolve(responseData);

    mockPost.callsFake(() => promise);

    component.setState({ currentPassword: 'testpassword' });
    component.verifyCurrentPassword();

    await promise;

    expect(component.state.message).toEqual('Failed to communicate with the server.');

  });

  it('should not submit the new password if it is different from the confirmPassword', async () => {

    const testData = {
      newPassword: 'testpassword',
      confirmPassword: 'testPassword'
    };

    component.setState(testData);

    component.submitNewPassword();

    const message = await validatePassword(testData.newPassword, testData.confirmPassword);

    expect(component.state.isSuccess).toEqual(false);
    expect(component.state.message).toEqual(message);

  });

  it('should submit the new password and resolve the response from the server', async (done) => {

    const testData = {
      newPassword: 'testpassword',
      confirmPassword: 'testpassword'
    };

    const responseData = { status: 204 };
    const responseDataTwo = { status: 12 };

    const promise = Promise.resolve(responseData);
    const promiseTwo = Promise.resolve(responseDataTwo);

    mockPost.callsFake(() => promiseTwo);

    await promise;

    mockPut.callsFake(() => promise);

    component.setState(testData);

    component.submitNewPassword();

    await promiseTwo;

    setImmediate(() => {
      expect(setStateSpy.calledWith({
        isSuccess: true,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        message: 'Your password has been successfully updated.'
      })).toEqual(true);
      done();
    });

  });

});
