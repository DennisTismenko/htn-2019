import {RouteProps} from 'react-router';
import {homeRoute} from '../../home/homeRoute';
import {packageRoute} from '../../package/packageRoute';
import HomeRoot from '../../home/HomeRoot.react';
import PackageRoot from '../../package/PackageRoot.react';
import NotFoundRoot from './NotFoundRoot.react';

export const routes: RouteProps[] = [
  {
    ...homeRoute,
    component: HomeRoot,
    // component: lazy(() => import('../../home/HomeRoot.react')),
  },
  {
    ...packageRoute,
    component: PackageRoot,
    // component: lazy(() => import('../../package/PackageRoot.react')),
  },
  {
    component: NotFoundRoot,
  },
];
