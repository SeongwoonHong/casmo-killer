import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import LocalLogin from './LocalLogin';

describe('<LocalLogin />', () => {

  let wrapper = null;

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <LocalLogin />
      </MemoryRouter>
    );
  });

  it('render two inputs and one submit button', () => {

    const UserPageContainer = wrapper.find('UserPageContainer');
    const UserInputFields = wrapper.find('UserInputField');

    expect(UserInputFields.first().find('input').is('input[type="email"]')).to.be.true;
    expect(UserInputFields.last().find('input').is('input[type="password"]')).to.be.true;
    expect(UserPageContainer.find('button').is('button[type="submit"]')).to.be.true;

  });

});
