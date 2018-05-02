/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';

import UserDropdown from './index';

describe('<UserDropdown />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(
      <UserDropdown
        active={ true }
        isLoggedIn={ true }
        currentRoute="/"
        onLogout={ () => {} } />
    );
  });

  it('renders the component consistently', () => {

    expect(component).toMatchSnapshot();

  });

});
