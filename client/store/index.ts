import { composeWithDevTools } from 'redux-devtools-extension'

const defaultState = {
  auth: {
    isLoading: false,
    user: null
  },
  post: {
    isLoading: false,
    posts: []
  }
}

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './modules';

export function initializeStore (initialState = defaultState) {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk)),
  );
}

export default initializeStore;
