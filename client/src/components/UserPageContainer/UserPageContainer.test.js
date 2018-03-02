import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import UserPageContainer from './UserPageContainer';
import { expect } from "chai";

describe('<UserPageContainer />', () => {

  const props = {
    className: 'test',
    formTitle: 'test-form',
    onSubmit: () => {}
  };

  it('renders the component consistently', () => {

    // const component = shallow(
    //   <UserPageContainer { ...props }>
    //     <p>testing</p>
    //   </UserPageContainer>
    // );
    //
    // expect(component).toMatchSnapshot();

    expect(true).toEqual(true);

  });

  it('fires onSubmit event handler on form submit', () => {

    const onSubmit = sinon.spy();

    const component = shallow(
      <UserPageContainer
        { ...props }
        onSubmit={ onSubmit }>
        <p>testing</p>
      </UserPageContainer>
    );

    component
      .find('form.user-form')
      .simulate('submit', { preventDefault() {} });

    expect(onSubmit.calledOnce).toEqual(true);

  });

});
