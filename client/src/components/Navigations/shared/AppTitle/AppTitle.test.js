import React from 'react';
import { shallow } from 'enzyme';

import AppTitle from './index';

describe('<AppTitle />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(<AppTitle />);
  });

  it('renders the component consistently', () => {

    expect(component).toMatchSnapshot();

  });

});
