/* eslint-env jest */

import { mount } from 'enzyme'
import React from 'react'
import { AuthLocal } from '../AuthLocal';

describe('AuthLocal', () => {
  it('should only have email input for signup request mode', () => {
    const emailInput = [
      {
        id: 'email',
        placeholder: 'Email Address',
        type: 'text',
        value: '',
        name: 'email',
        onChange: () => {},
      }
    ];
    const authLocal = mount(<AuthLocal mode="signupRequest" inputs={emailInput} errors={{}} />)

    expect(authLocal.find('.email-input').exists()).toEqual(true);
  })

  it('shouldn"t have any othre input fields other than email for request mode', () => {
    const emailInput = [
      {
        id: 'email',
        placeholder: 'Email Address',
        type: 'text',
        value: '',
        name: 'email',
        onChange: () => {},
      }
    ];
    const authLocal = mount(<AuthLocal mode="signupRequest" inputs={emailInput} errors={{}} />)

    expect(authLocal.find('.password-input').exists()).toEqual(false);
  })

  it('shouldn"t have any errors when errors object is empty', () => {
    const emailInput = [
      {
        id: 'email',
        placeholder: 'Email Address',
        type: 'text',
        value: '',
        name: 'email',
        onChange: () => {},
      }
    ];
    const authLocal = mount(<AuthLocal mode="signupRequest" inputs={emailInput} errors={{}} />)

    expect(authLocal.find('.authlocal-error').text()).toBe('');
  });

  it('should have errors if needed', () => {
    const emailInput = [
      {
        id: 'email',
        placeholder: 'Email Address',
        type: 'text',
        value: '',
        name: 'email',
        onChange: () => {},
      }
    ];
    const authLocal = mount(<AuthLocal mode="signupRequest" inputs={emailInput} errors={{email: 'error!'}} />)

    expect(authLocal.find('.authlocal-error').text()).toBe('error!');
  });

  it('should have email and password field for login mode', () => {
    const loginInputs = [
      {
        id: 'email',
        placeholder: 'Email Address',
        type: 'text',
        value: '',
        name: 'email',
        onChange: () => {},
      },
      {
        id: 'password',
        placeholder: 'Password',
        type: 'password',
        value: '',
        name: 'password',
        onChange: () => {}
      },
    ];

    const authLocal = mount(<AuthLocal mode="login" inputs={loginInputs} errors={{}} />);

    expect(authLocal.find('.email-input').exists()).toBe(true);
    expect(authLocal.find('.password-input').exists()).toBe(true);
  })
})
