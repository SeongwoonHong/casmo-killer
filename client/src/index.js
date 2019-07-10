import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router } from 'react-router-dom';
import './styles/app.scss';
import App from './App';
import RootStore from './stores';

const rootStore = new RootStore();
const history = require('history').createBrowserHistory();

ReactDOM.render(
  <Provider {...rootStore}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
