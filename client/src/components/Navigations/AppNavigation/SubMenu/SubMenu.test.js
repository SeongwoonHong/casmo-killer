import React from 'react';
import { shallow } from 'enzyme';

import SubMenu from './index';

describe('<SubMenu />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(
      <SubMenu items={ [
        {
          name: 'a',
          path: ''
        },
        {
          name: 'b',
          path: ''
        },
        {
          name: 'c',
          path: ''
        }
      ] } />
    );
  });

  it('renders the component consistently', () => {

    expect(component).toMatchSnapshot();
    expect(component.find('.Sub-menu__list__items').length).toEqual(3);

  });

});
