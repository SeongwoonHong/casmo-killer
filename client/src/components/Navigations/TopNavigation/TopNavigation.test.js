import React from 'react';
import { shallow } from 'enzyme';

import TopNavigation from './TopNavigation';

describe('<TopNavigation />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(<TopNavigation />);
  });

  it('renders the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

});
