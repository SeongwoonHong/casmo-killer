import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import App from './App';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';

const isDevelopment = process.env.NODE_ENV === 'development';

const store = createStore(
  reducers,
  isDevelopment
    ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    : null,
  applyMiddleware(reduxThunk)
);

let TestRoutes;
if (isDevelopment) {
  TestRoutes = require('./test/routes').default;
}

window.store = store;

ReactDOM.render(
  <Provider store={ store }>
    <BrowserRouter>
      <Switch>
        {
          isDevelopment
            ? <Route path="/test" component={ TestRoutes } />
            : null
        }
        <Route path="/" component={ App } />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
registerServiceWorker();
