import React from 'react';
import { shallow } from 'enzyme';

import PrivateRoute from './PrivateRoute';

describe('<PrivateRoute />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(<PrivateRoute />);
  });

  it('renders the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  // TODO: this heavily relies on react-router-dom but may still need more robust testing

});
