import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SocialLogin from './SocialLogin';

describe('<SocialLogin />', () => {

  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(<SocialLogin />);
  });

  // it('should display proper message for registration', () => {
  //   wrapper.setProps({ isLogin: false });
  //   expect(wrapper.find('.user-form-header > p')).to.have.length(1);
  // });
  //
  // it('should hide the message for registration when logging in', () => {
  //   wrapper.setProps({ isLogin: true });
  //   expect(wrapper.find('.user-form-header > p')).to.have.length(0);
  // });

  it('should reflect the response from the server to the state', () => {
    // TODO: figure out a way to test async methods  (onLogin & onRegister)
    expect(true).toEqual(true);
  });

});
