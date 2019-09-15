import {RouteProps} from 'react-router-dom';

export interface PackageRootParams {
  pkg: string;
  version: string;
}

export const packageRoute: RouteProps = {
  path: '/:pkg/:version',
  exact: true,
};
