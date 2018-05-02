import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import TopNavBtn from './index';

describe('<TopNavBtn />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(<TopNavBtn />);
  });

  it('renders the component consistently', () => {

    expect(component).toMatchSnapshot();

  });

  it('fires onClick event handler', () => {

    const onClick = sinon.spy();

    const wrapper = shallow(
      <TopNavBtn onClick={ onClick } />
    );

    wrapper.find('button').simulate('click');

    expect(onClick.calledOnce).toEqual(true);

  });

});
