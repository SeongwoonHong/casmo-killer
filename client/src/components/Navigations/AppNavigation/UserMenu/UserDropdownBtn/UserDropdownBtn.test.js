/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';

import UserDropdownBtn from './index';

describe('<UserDropdownBtn />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(
      <UserDropdownBtn />
    );
  });

  it('renders the component consistently', () => {

    expect(component).toMatchSnapshot();

  });

});
