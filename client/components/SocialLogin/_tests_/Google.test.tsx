import { mount, shallow } from 'enzyme'
import React from 'react'
import { Google } from '../Google';

describe('<Google />', () => {
  const props = {
    icon: '/static/images/google-logo.png',
    id: 'gmail',
    clientId: 'jiaojojzio',
    onSuccess: () => {},
    onFailure: () => {},
    className: 'gmail',
  }
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  // @ts-ignore
  useStateSpy.mockImplementation((init) => [init, setState]);
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches the snapshot', () => {
    const component = shallow(<Google {...props}>Login with Google</Google>);
    expect(component).toMatchSnapshot();
  });

  it('should show children when it"s done loading sdk', () => {
    // jest.useFakeTimers();
    console.log(setState);
    const component = shallow(<Google {...props}>Login with Google</Google>);
    // setTimeout(() => {

    // }, 5000);
  });
});
