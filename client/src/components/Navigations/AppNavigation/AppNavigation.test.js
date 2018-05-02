/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';

import AppNavigation from './AppNavigation';

describe('<AppNavigation />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(
      <AppNavigation
        layout={ {
          isMainMenuVisible: true,
          isUserMenuVisible: true
        }}
        location={ {
          pathname: '/'
        }} />
    );
  });

  it('renders the component consistently', () => {

    expect(component).toMatchSnapshot();

  });

});
