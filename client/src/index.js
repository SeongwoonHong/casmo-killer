import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route } from 'react-router-dom';
import reduxThunk from 'redux-thunk';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';

const isDevelopment = process.env.NODE_ENV === 'development';

const store = createStore(reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(reduxThunk));

let TestRoutes;
if (isDevelopment) {
  TestRoutes = require('./test/routes').default;
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        {
          isDevelopment
          ? <Route path="/test" component={TestRoutes} />
          : null
        }
        <Route exact path="/" component={App} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
registerServiceWorker();
