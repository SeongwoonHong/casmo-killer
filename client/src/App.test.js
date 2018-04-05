import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import App from './App';

const initialState = { output: 100 };
const mockStore = configureStore();

let store = null;
let container = null;

describe('<SocialLogin />', () => {

  beforeEach(() => {
    store = mockStore(initialState);
    container = shallow(<App store={ store } />);
  });

  it('should render App component consistently', () => {
    expect(container).toMatchSnapshot();
  });

});
