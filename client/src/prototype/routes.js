import React from 'react';
import { Route, Switch } from 'react-router-dom';
import prototype from './prototype';

const TestRoutes = ({ match }) => (
  <Switch>
    {
      Object.keys(prototype).map((component, i) => {
        const componentData = prototype[component];
        let Component;

        Component = componentData.component.default || componentData.components.default;

        const { props } = componentData;

        return (
          <Route
            path={`${match.url}/${component}`}
            key={component}
            render={() =>
              <Component {...props} />
            }
          />
        );
      })
    }
  </Switch>
);

export default TestRoutes;
