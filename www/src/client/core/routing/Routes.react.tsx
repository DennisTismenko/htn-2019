// Suspense for server side rendering is coming soon!
// https://reactjs.org/blog/2018/11/27/react-16-roadmap.html#suspense-for-server-rendering
// import React, {lazy} from 'react';
import React from 'react';
import {Switch, Route} from 'react-router';
import {routes} from './routes';
import {routePathToString} from './routePathToString';

export function Routes() {
  return (
    <Switch>
      {routes.map(route => (
        <Route key={routePathToString(route.path)} {...route} />
      ))}
    </Switch>
  );
}
