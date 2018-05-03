import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AvatarUploader from './AvatarUploader';

describe('<AvatarUploader />', () => {

  const props = {
    className: 'testing',
    avatar: {
      value: 'testing'
    },
    onChange: () => {},
    onError: () => {}
  };

  it('renders the component consistently', () => {

    const component = shallow(
      <AvatarUploader { ...props } />
    );

    expect(component).toMatchSnapshot();

  });

  it('fires onChange event handler', () => {

    const spy = sinon.spy(AvatarUploader.prototype, 'onImageUpload');

    const target = {
      files: [
        new Blob(['testing'], {
          type: 'img/*'
        })
      ]
    };

    const component = shallow(<AvatarUploader{ ...props } />);

    component.find('input').simulate('change', { target });

    expect(spy.calledWith({ target })).toEqual(true);

  });

});
