import { composeWithDevTools } from 'redux-devtools-extension'

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './modules';

export function initializeStore (initialState = {}) {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk)),
  );
}

export default initializeStore;
