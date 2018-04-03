/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';

import UserDelete from './UserDelete';

describe('<UserDelete />', () => {

  let component;
  let mockDelete;

  beforeEach(() => {

    const user = { strategy: 'local' };

    component = shallow(
      <UserDelete user={ user } />
    );

    mockDelete = sinon.stub(axios, 'delete');

  });

  afterEach(() => {
    mockDelete.restore();
  });

  it('should render the component consistently', () => {
    expect(component).toMatchSnapshot();
  });

  it('should set the agreed state to true for further actions', () => {
    component.instance().onSubmitHandler();
    expect(component.state('agreed')).toEqual(true);
  });

  it('should make a DELETE request and resolve the response from the server', async () => {

    const spy = sinon.spy();

    const responseData = { data: { message: 'server messsage' } };
    const promise = Promise.resolve(responseData);

    mockDelete.callsFake(() => promise);

    const wrapper = shallow(
      <UserDelete
        user={ { strategy: 'local' } }
        removeUser={ spy } />
    );

    wrapper.setState({
      agreed: true,
      payload: 'delete payload'
    });
    wrapper.instance().onSubmitHandler();

    await promise;

    expect(wrapper.state('isSuccess')).toEqual(true);
    expect(wrapper.state('agreed')).toEqual(false);
    expect(wrapper.state('message')).toEqual(responseData.data.message);
    expect(spy.calledOnce).toEqual(true);

  });

});
