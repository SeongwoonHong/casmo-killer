/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';

import MainMenu from './index';

describe('<MainMenu />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(
      <MainMenu
        active={ true }
        menus={ [
          {
            name: 'a',
            icon: 'a',
            path: '/'
          },
          {
            name: 'b',
            icon: 'a',
            path: '/'
          },
          {
            name: 'c',
            icon: 'a',
            path: '/'
          }
        ] } />
    );
  });

  it('renders the component consistently', () => {

    expect(component).toMatchSnapshot();
    expect(component.find('.Main-menu__list__items').length).toEqual(3);

  });

});
