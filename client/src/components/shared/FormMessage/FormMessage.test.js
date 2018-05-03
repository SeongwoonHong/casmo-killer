import React from 'react';
import { shallow } from 'enzyme';

import FormMessage from './index';

describe('<FormMessage />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(<FormMessage />);
  });

  it('renders the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

});
