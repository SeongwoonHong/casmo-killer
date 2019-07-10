import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Main from 'routes/main';
import Signup from 'routes/signup';
import Login from 'routes/login';

const isDevelopment = process.env.NODE_ENV !== 'production';

let Prototype;
let PrototypeRoutes;
if (isDevelopment) {
  Prototype = require('./prototype').default;
  PrototypeRoutes = require('./prototype/routes').default;
}

const App = props => {
  return (
    <div className="App">
      <Switch>
        {
          isDevelopment ? (
            <Route path="/prototype" component={Prototype} />
          ) : null
        }
        <Route path="/main" component={Main} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </div>
  );
};

export default App;
