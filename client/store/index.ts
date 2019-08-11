import { composeWithDevTools } from 'redux-devtools-extension'

const defaultState = {
}

import { applyMiddleware, createStore, compose } from 'redux';
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
