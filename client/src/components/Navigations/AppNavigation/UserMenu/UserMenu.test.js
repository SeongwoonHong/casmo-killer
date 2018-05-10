/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';

import { UserMenu } from './UserMenu';

describe('<UserMenu />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(
      <UserMenu
        active={ true }
        user={ {
          isLoggedIn: false
        } }
        currentRoute="/"
        toggleUserMenu={ () => {} }
        logout={ () => {} } />
    );
  });

  it('renders the component consistently', () => {

    expect(component).toMatchSnapshot();

  });

});
