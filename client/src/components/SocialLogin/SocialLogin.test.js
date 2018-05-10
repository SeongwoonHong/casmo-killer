import React from 'react';
import { shallow } from 'enzyme';

import SocialLogin from './SocialLogin';

// TODO:
// this component heavily relies on third party SDKs,
// so there is not much to test here.
describe('<SocialLogin />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(<SocialLogin />);
  });

  it('renders the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('should display correct message for login and registration', () => {

    expect(component.find('h3 + p').text()).toEqual('User your favourite social network to sign up.');

    component.setProps({ isLogin: true });

    expect(component.find('h3 + p').exists()).toEqual(false);

  });

});
