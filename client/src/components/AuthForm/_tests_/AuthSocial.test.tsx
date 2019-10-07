import { mount } from 'enzyme'
import React from 'react'
import { AuthSocial } from '../AuthSocial';

describe('AuthSocial', () => {
  it('should have Google, Facebook and Kakaotalk login buttons', () => {
    const authSocial = mount(<AuthSocial mode="login" />);

    expect(authSocial.find('#google').exists()).toBe(true);
    expect(authSocial.find('#facebook').exists()).toBe(true);
    expect(authSocial.find('#kakaotalk').exists()).toBe(true);
  });
});
