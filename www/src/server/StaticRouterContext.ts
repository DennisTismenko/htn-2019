// @flow

import ReactRouter from 'react-router';

export type StaticRouterContext = ReactRouter.StaticRouterContext & {
  status?: number;
};
