import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Landing from './components/landing';

const index = props => {
  return (
    <div>
      <Switch>
        <Route paht="/main" component={Landing} />
      </Switch>
    </div>
  );
};

export default index;
