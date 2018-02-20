import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import UserInputField from './UserInputField';

describe('<UserInputField />', () => {

  const props = {
    name: 'email',
    value: 'ckboardtoronto@gmail.com',
    onChange: () => {}
  };

  it('renders the component consistently', () => {

    const component = shallow(
      <UserInputField { ...props } />
    );

    expect(component).toMatchSnapshot();

  });

  it('hides the component', () => {

    const component = shallow(
      <UserInputField { ...props } />
    );

    component.setProps({ isVisible: false });

    expect(component.isEmptyRender()).toEqual(true);

  });

  it('fires onChange event handler', () => {

    const onChange = sinon.spy();

    const component = shallow(
      <UserInputField { ...props } onChange={ onChange } />
    );

    component
      .find('input')
      .simulate('change', {
        target: {
          name: 'email',
          value: 'ssinsoo@gmail.com'
        }
      });

    expect(onChange.calledOnce).toEqual(true);

  });

});
