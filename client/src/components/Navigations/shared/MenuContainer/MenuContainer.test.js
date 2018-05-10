/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';

import MenuContainer from './index';

describe('<MenuContainer />', () => {

  let component = null;

  beforeEach(() => {
    component = shallow(
      <MenuContainer
        active={ true }
        className="testing"
        onClose={ () => {} }>
        <p>testing</p>
      </MenuContainer>
    );
  });

  it('renders the component consistently', () => {

    expect(component).toMatchSnapshot();

  });

});
